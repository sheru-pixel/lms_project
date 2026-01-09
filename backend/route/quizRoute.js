import express from 'express'
import isAuth from '../middleware/isauth.js'
import {
  createQuiz,
  getQuiz,
  submitQuiz,
  checkQuizStatus,
  getCertificateStats,
  getQuizResults
} from '../contollers/quizController.js'
import {
  generateCertificate,
  getCertificate,
  downloadCertificate,
  getUserCertificates
} from '../contollers/certificateController.js'

const quizRouter = express.Router()

// Quiz routes
quizRouter.post('/course/:courseId/create', isAuth, createQuiz)
quizRouter.get('/course/:courseId/quiz', getQuiz)
quizRouter.post('/course/:courseId/submit', isAuth, submitQuiz)
quizRouter.get('/course/:courseId/status', isAuth, checkQuizStatus)

// Educator routes (for viewing statistics and results)
quizRouter.get('/course/:courseId/stats', isAuth, getCertificateStats)
quizRouter.get('/course/:courseId/results', isAuth, getQuizResults)

// Certificate routes
quizRouter.post('/generate-certificate', isAuth, generateCertificate)
quizRouter.get('/certificate/:certificateId', getCertificate)
quizRouter.get('/download/:courseId', isAuth, downloadCertificate)
quizRouter.get('/my-certificates', isAuth, getUserCertificates)

export default quizRouter
