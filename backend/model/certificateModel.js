import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  quizScore: {
    type: Number,
    required: true,
    description: 'Number of correct answers (out of 10)'
  },
  certificateNumber: {
    type: String,
    unique: true,
    required: true,
    description: 'Unique certificate identifier'
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  certificateUrl: {
    type: String,
    description: 'URL to download the certificate PDF'
  }
})

const Certificate = mongoose.model('Certificate', certificateSchema)
export default Certificate
