import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: [
    {
      questionNumber: Number,
      question: {
        type: String,
        required: true
      },
      options: [
        {
          text: String,
          isCorrect: Boolean
        }
      ],
      explanation: String
    }
  ],
  passingScore: {
    type: Number,
    default: 7,
    description: 'Minimum correct answers needed to pass (out of 10)'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Quiz = mongoose.model('Quiz', quizSchema)
export default Quiz
