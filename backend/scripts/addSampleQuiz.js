import axios from 'axios'

// Sample quiz data
const sampleQuiz = {
  questions: [
    {
      questionNumber: 1,
      question: "What is the main goal of effective learning?",
      options: [
        { text: "To pass exams", isCorrect: false },
        { text: "To gain knowledge and skills", isCorrect: true },
        { text: "To spend time in school", isCorrect: false },
        { text: "To please teachers", isCorrect: false }
      ],
      explanation: "The primary goal of learning is to acquire knowledge and develop skills that can be applied practically."
    },
    {
      questionNumber: 2,
      question: "Which of the following is a key component of a study plan?",
      options: [
        { text: "Watching TV", isCorrect: false },
        { text: "Setting clear goals and schedules", isCorrect: true },
        { text: "Sleeping late", isCorrect: false },
        { text: "Social media browsing", isCorrect: false }
      ],
      explanation: "A good study plan includes clear, measurable goals and a realistic schedule for achieving them."
    },
    {
      questionNumber: 3,
      question: "What is the Pomodoro Technique?",
      options: [
        { text: "A cooking method", isCorrect: false },
        { text: "A time management technique using 25-minute intervals", isCorrect: true },
        { text: "A type of exercise", isCorrect: false },
        { text: "A meditation practice", isCorrect: false }
      ],
      explanation: "The Pomodoro Technique is a time management method that breaks work into focused 25-minute intervals separated by short breaks."
    },
    {
      questionNumber: 4,
      question: "How does active recall improve learning?",
      options: [
        { text: "It doesn't help", isCorrect: false },
        { text: "It strengthens memory by retrieving information from memory", isCorrect: true },
        { text: "It makes studying easier", isCorrect: false },
        { text: "It reduces study time", isCorrect: false }
      ],
      explanation: "Active recall strengthens neural pathways and long-term retention by forcing your brain to retrieve information."
    },
    {
      questionNumber: 5,
      question: "What is the best way to take notes?",
      options: [
        { text: "Write everything word-for-word", isCorrect: false },
        { text: "Use your own words and structure", isCorrect: true },
        { text: "Don't take notes at all", isCorrect: false },
        { text: "Only highlight text", isCorrect: false }
      ],
      explanation: "Taking notes in your own words helps with comprehension and retention better than verbatim copying."
    },
    {
      questionNumber: 6,
      question: "How much sleep is recommended for optimal learning?",
      options: [
        { text: "4-5 hours", isCorrect: false },
        { text: "7-9 hours", isCorrect: true },
        { text: "10-12 hours", isCorrect: false },
        { text: "Sleep doesn't matter for learning", isCorrect: false }
      ],
      explanation: "Adults typically need 7-9 hours of quality sleep for optimal cognitive function and learning."
    },
    {
      questionNumber: 7,
      question: "What is spaced repetition?",
      options: [
        { text: "Studying at different locations", isCorrect: false },
        { text: "Reviewing material at increasing intervals", isCorrect: true },
        { text: "Taking repeated breaks", isCorrect: false },
        { text: "Repeating everything out loud", isCorrect: false }
      ],
      explanation: "Spaced repetition involves reviewing material at strategically increasing intervals to maximize long-term retention."
    },
    {
      questionNumber: 8,
      question: "Which learning style is most effective?",
      options: [
        { text: "Visual only", isCorrect: false },
        { text: "Auditory only", isCorrect: false },
        { text: "A combination of multiple styles", isCorrect: true },
        { text: "Kinesthetic only", isCorrect: false }
      ],
      explanation: "Research shows that combining multiple learning modalities is most effective for most learners."
    },
    {
      questionNumber: 9,
      question: "What is metacognition?",
      options: [
        { text: "Thinking about your thinking", isCorrect: true },
        { text: "Reading a lot", isCorrect: false },
        { text: "Having a high IQ", isCorrect: false },
        { text: "Speed of learning", isCorrect: false }
      ],
      explanation: "Metacognition is the awareness and regulation of one's own thought processes - 'thinking about thinking'."
    },
    {
      questionNumber: 10,
      question: "Which environment is best for focused learning?",
      options: [
        { text: "A noisy, distracting place", isCorrect: false },
        { text: "A quiet, organized space", isCorrect: true },
        { text: "Surrounded by people", isCorrect: false },
        { text: "In a dark room", isCorrect: false }
      ],
      explanation: "A quiet, organized environment with minimal distractions is ideal for focused, effective learning."
    }
  ],
  passingScore: 7
}

// Function to add quiz to a course
async function addQuizToCourse(courseId, authToken) {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/quiz/course/${courseId}/create`,
      sampleQuiz,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Cookie': `token=${authToken}`
        },
        withCredentials: true
      }
    )
    console.log('Quiz added successfully:', response.data)
  } catch (error) {
    console.error('Error adding quiz:', error.response?.data || error.message)
  }
}

export { addQuizToCourse, sampleQuiz }
