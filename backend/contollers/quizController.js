import Quiz from '../model/quizModel.js'
import Certificate from '../model/certificateModel.js'
import Course from '../model/courseModel.js'
import mongoose from 'mongoose'

// Create or update quiz for a course
export const createQuiz = async (req, res) => {
  try {
    const { courseId, questions, passingScore } = req.body
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    // Verify user is the course educator
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.educator.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to create quiz for this course" })
    }

    if (!questions || questions.length !== 10) {
      return res.status(400).json({ message: "Quiz must have exactly 10 questions" })
    }

    // Check if quiz already exists
    let quiz = await Quiz.findOne({ courseId })
    
    if (quiz) {
      // Update existing quiz
      quiz.questions = questions
      quiz.passingScore = passingScore || 7
      await quiz.save()
      return res.status(200).json({ message: "Quiz updated successfully", quiz })
    } else {
      // Create new quiz
      quiz = new Quiz({
        courseId,
        questions,
        passingScore: passingScore || 7
      })
      await quiz.save()
      return res.status(201).json({ message: "Quiz created successfully", quiz })
    }
  } catch (error) {
    console.error('Error creating quiz:', error)
    return res.status(500).json({ message: "Failed to create quiz", error: error.message })
  }
}

// Get quiz for a course
export const getQuiz = async (req, res) => {
  try {
    const { courseId } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    const quiz = await Quiz.findOne({ courseId })
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found for this course" })
    }

    // Don't send the correct answers to the frontend
    const quizForStudent = {
      _id: quiz._id,
      courseId: quiz.courseId,
      questions: quiz.questions.map(q => ({
        questionNumber: q.questionNumber,
        question: q.question,
        options: q.options.map(opt => ({
          text: opt.text
          // Don't include isCorrect
        })),
        explanation: q.explanation
      })),
      passingScore: quiz.passingScore
    }

    return res.status(200).json(quizForStudent)
  } catch (error) {
    console.error('Error getting quiz:', error)
    return res.status(500).json({ message: "Failed to get quiz", error: error.message })
  }
}

// Submit quiz answers and check score
export const submitQuiz = async (req, res) => {
  try {
    const { courseId } = req.params
    const { answers } = req.body // answers should be array of selected option indices
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return res.status(400).json({ message: "All 10 questions must be answered" })
    }

    const quiz = await Quiz.findOne({ courseId })
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found for this course" })
    }

    // Calculate score
    let correctCount = 0
    const detailedResults = quiz.questions.map((question, idx) => {
      const selectedOptionIndex = answers[idx]
      const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect)
      const isCorrect = selectedOptionIndex === correctOptionIndex
      
      if (isCorrect) {
        correctCount++
      }

      return {
        questionNumber: question.questionNumber,
        question: question.question,
        selectedOption: question.options[selectedOptionIndex]?.text,
        correctOption: question.options[correctOptionIndex]?.text,
        isCorrect,
        explanation: question.explanation
      }
    })

    const passed = correctCount >= quiz.passingScore

    return res.status(200).json({
      passed,
      score: correctCount,
      totalQuestions: 10,
      passingScore: quiz.passingScore,
      detailedResults
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return res.status(500).json({ message: "Failed to submit quiz", error: error.message })
  }
}

// Check if user has passed the quiz and can download certificate
export const checkQuizStatus = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    const certificate = await Certificate.findOne({ userId, courseId })

    if (certificate) {
      return res.status(200).json({
        passed: true,
        certificateNumber: certificate.certificateNumber,
        score: certificate.quizScore,
        issuedDate: certificate.issuedDate
      })
    } else {
      return res.status(200).json({
        passed: false,
        message: "Quiz not yet completed or failed"
      })
    }
  } catch (error) {
    console.error('Error checking quiz status:', error)
    return res.status(500).json({ message: "Failed to check quiz status", error: error.message })
  }
}

// Get certificate statistics for a course (educator only)
export const getCertificateStats = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    // Verify user is the course educator
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.educator.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to view statistics for this course" })
    }

    // Get all certificates for this course
    const certificates = await Certificate.find({ courseId })
      .populate('userId', 'name email')
      .sort({ issuedDate: -1 })

    // Calculate statistics
    const totalStudents = course.enrolledStudents.length
    const certificatesIssued = certificates.length
    const passRate = totalStudents > 0 ? Math.round((certificatesIssued / totalStudents) * 100) : 0
    const averageScore = certificatesIssued > 0
      ? Math.round(certificates.reduce((sum, cert) => sum + cert.quizScore, 0) / certificatesIssued * 10) / 10
      : 0

    return res.status(200).json({
      courseId,
      courseName: course.title,
      totalEnrolledStudents: totalStudents,
      certificatesIssued,
      passRate,
      averageScore,
      certificates
    })
  } catch (error) {
    console.error('Error getting certificate stats:', error)
    return res.status(500).json({ message: "Failed to get certificate statistics", error: error.message })
  }
}

// Get all quiz attempts/results for a course (educator only)
export const getQuizResults = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    // Verify user is the course creator (educator)
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.educator.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to view results for this course" })
    }

    // Get all certificates for this course (representing successful attempts)
    const quizResults = await Certificate.find({ courseId })
      .populate('userId', 'name email')
      .sort({ issuedDate: -1 })

    // Format results
    const formattedResults = quizResults.map(cert => ({
      studentName: cert.userName,
      studentEmail: cert.userId?.email,
      studentId: cert.userId?._id,
      score: cert.quizScore,
      totalQuestions: 10,
      passingScore: 7,
      passed: cert.quizScore >= 7,
      certificateNumber: cert.certificateNumber,
      issuedDate: cert.issuedDate
    }))

    return res.status(200).json({
      courseId,
      courseName: course.title,
      totalResults: formattedResults.length,
      results: formattedResults
    })
  } catch (error) {
    console.error('Error getting quiz results:', error)
    return res.status(500).json({ message: "Failed to get quiz results", error: error.message })
  }
}
