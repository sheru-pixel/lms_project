import Certificate from '../model/certificateModel.js'
import Course from '../model/courseModel.js'
import User from '../model/userModel.js'
import mongoose from 'mongoose'
import PDFDocument from 'pdfkit'

// Generate certificate for passed quiz
export const generateCertificate = async (req, res) => {
  try {
    const { courseId, quizScore } = req.body
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    if (quizScore < 7) {
      return res.status(400).json({ message: "Quiz score must be at least 7 to get a certificate" })
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({ userId, courseId })
    if (existingCertificate) {
      return res.status(200).json({ 
        message: "Certificate already exists",
        certificate: existingCertificate 
      })
    }

    // Get course and user details
    const [course, user] = await Promise.all([
      Course.findById(courseId),
      User.findById(userId)
    ])

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate unique certificate number (CERT-YYYYMMDD-RANDOM)
    const now = new Date()
    const dateStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
    const randomStr = Math.random().toString(36).substr(2, 8).toUpperCase()
    const certificateNumber = `CERT-${dateStr}-${randomStr}`

    // Create certificate record
    const certificate = new Certificate({
      userId,
      courseId,
      courseName: course.title,
      userName: user.name || user.email,
      quizScore,
      certificateNumber,
      issuedDate: now
    })

    await certificate.save()

    return res.status(201).json({
      message: "Certificate generated successfully",
      certificate
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return res.status(500).json({ message: "Failed to generate certificate", error: error.message })
  }
}

// Get certificate details
export const getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      return res.status(400).json({ message: "Invalid certificate ID" })
    }

    const certificate = await Certificate.findById(certificateId)
      .populate('userId', 'name email')
      .populate('courseId', 'title')

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" })
    }

    return res.status(200).json(certificate)
  } catch (error) {
    console.error('Error getting certificate:', error)
    return res.status(500).json({ message: "Failed to get certificate", error: error.message })
  }
}

// Download certificate (generate PDF)
export const downloadCertificate = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    const certificate = await Certificate.findOne({ userId, courseId })

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found. Please pass the quiz first." })
    }

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    })

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`)

    // Pipe PDF to response
    doc.pipe(res)

    // Add decorative border
    doc.rect(40, 40, 515, 757).lineWidth(3).stroke('#667eea')
    doc.rect(50, 50, 495, 737).lineWidth(1).stroke('#667eea')

    // Add title
    doc.fontSize(48).font('Helvetica-Bold').fillColor('#667eea').text('CERTIFICATE', 0, 100, { align: 'center' })
    doc.fontSize(16).font('Helvetica').fillColor('#333').text('OF COMPLETION', 0, 155, { align: 'center' })

    // Add decorative line
    doc.moveTo(150, 180).lineTo(450, 180).stroke('#667eea')

    // Add "This is to certify that" text
    doc.fontSize(14).font('Helvetica').fillColor('#333').text('This is to certify that', 0, 210, { align: 'center' })

    // Add student name
    doc.fontSize(28).font('Helvetica-Bold').fillColor('#667eea').text(certificate.userName, 0, 250, { align: 'center' })

    // Add "has successfully completed" text
    doc.fontSize(14).font('Helvetica').fillColor('#333').text('has successfully completed the course', 0, 310, { align: 'center' })

    // Add course name
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#667eea').text(certificate.courseName, 50, 340, { width: 495, align: 'center' })

    // Add "and passed the assessment" text
    doc.fontSize(14).font('Helvetica').fillColor('#333').text('and passed the assessment with a score of', 0, 400, { align: 'center' })

    // Add score
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#28a745').text(`${certificate.quizScore} out of 10`, 0, 435, { align: 'center' })

    // Add date issued
    const issuedDate = new Date(certificate.issuedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.fontSize(12).font('Helvetica').fillColor('#333').text(`Date Issued: ${issuedDate}`, 0, 500, { align: 'center' })

    // Add certificate number
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(`Certificate Number: ${certificate.certificateNumber}`, 0, 530, { align: 'center' })

    // Add decorative line at bottom
    doc.moveTo(150, 600).lineTo(450, 600).stroke('#667eea')

    // Add footer text
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('This certificate is awarded in recognition of academic achievement and course completion.', 50, 630, { width: 495, align: 'center' })

    // Finalize PDF
    doc.end()
  } catch (error) {
    console.error('Error downloading certificate:', error)
    return res.status(500).json({ message: "Failed to download certificate", error: error.message })
  }
}

// Get user's certificates
export const getUserCertificates = async (req, res) => {
  try {
    const userId = req.userId

    const certificates = await Certificate.find({ userId })
      .populate('courseId', 'title thumbnail')
      .sort({ issuedDate: -1 })

    return res.status(200).json(certificates)
  } catch (error) {
    console.error('Error getting user certificates:', error)
    return res.status(500).json({ message: "Failed to get certificates", error: error.message })
  }
}
