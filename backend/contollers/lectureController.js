import Lecture from "../model/lectureModel.js"
import Course from "../model/courseModel.js"
import mongoose from "mongoose"
import uploadToCloudinary from "../config/cloudinary.js"

export const createLecture = async (req, res) => {
  try {
    console.log('\n========== CREATE LECTURE START ==========')
    console.log('Request body:', JSON.stringify(req.body))
    console.log('Request params:', JSON.stringify(req.params))
    console.log('UserId:', req.userId)
    
    const { title } = req.body
    const { courseId } = req.params
    
    console.log('Extracted title:', title)
    console.log('Extracted courseId:', courseId)
    
    if (!title) {
      console.log('ERROR: Missing title')
      return res.status(400).json({ message: "Title is required" })
    }
    
    if (!courseId) {
      console.log('ERROR: Missing courseId')
      return res.status(400).json({ message: "Course ID is required" })
    }

    // Validate courseId is a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      console.log('ERROR: Invalid ObjectId format:', courseId)
      return res.status(400).json({ message: "Invalid course ID format" })
    }

    console.log('Searching for course with ID:', courseId)
    const course = await Course.findById(courseId)
    console.log('Course search result:', course)
    
    if (!course) {
      console.log('ERROR: Course not found for ID:', courseId)
      console.log('This might mean:')
      console.log('1. Course ID is incorrect')
      console.log('2. Course was deleted')
      console.log('3. Course was not saved properly')
      return res.status(404).json({ 
        message: "Course not found", 
        courseId: courseId,
        suggestion: "Make sure you create a course first before adding lectures"
      })
    }
    
    console.log('Course found:', course.title)

    console.log('Creating lecture document...')
    const lecture = await Lecture.create({
      title,
      videoUrl: "",
      isPreviewfree: false,
      courseId
    })
    
    console.log('Lecture created with ID:', lecture._id)

    // Add lecture to course
    if (!course.lectures) {
      console.log('Initializing lectures array on course')
      course.lectures = []
    }
    
    console.log('Pushing lecture ID to course.lectures')
    course.lectures.push(lecture._id)
    
    console.log('Saving course...')
    await course.save()

    console.log('SUCCESS: Lecture created')
    console.log('========== CREATE LECTURE END ==========\n')
    return res.status(201).json(lecture)
  } catch (error) {
    console.log('CATCH ERROR in createLecture')
    console.error('Error message:', error.message)
    console.error('Error name:', error.name)
    console.error('Full error:', error)
    console.log('========== CREATE LECTURE ERROR ==========\n')
    return res.status(500).json({ 
      message: "Failed to create lecture", 
      error: error.message
    })
  }
}

export const getLecturesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId).populate("lectures")
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }
    return res.status(200).json(course.lectures || [])
  } catch (error) {
    console.error('Error getting lectures:', error)
    return res.status(500).json({ message: "Failed to get lectures", error: error.message })
  }
}

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params
    const lecture = await Lecture.findById(lectureId)
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" })
    }
    return res.status(200).json(lecture)
  } catch (error) {
    return res.status(500).json({ message: "Failed to get lecture" })
  }
}

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params
    const { title, videoUrl, isPreviewfree } = req.body

    let lecture = await Lecture.findById(lectureId)
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" })
    }

    const updatedData = {}
    if (title !== undefined) updatedData.title = title
    if (videoUrl !== undefined) updatedData.videoUrl = videoUrl
    if (isPreviewfree !== undefined) updatedData.isPreviewfree = isPreviewfree

    lecture = await Lecture.findByIdAndUpdate(lectureId, updatedData, { new: true })
    return res.status(200).json(lecture)
  } catch (error) {
    console.error('Error updating lecture:', error)
    return res.status(500).json({ message: "Failed to update lecture", error: error.message })
  }
}

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params
    const lecture = await Lecture.findById(lectureId)
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" })
    }

    // Remove lecture from course
    await Course.updateOne(
      { _id: lecture.courseId },
      { $pull: { lectures: lectureId } }
    )

    await Lecture.findByIdAndDelete(lectureId)
    return res.status(200).json({ message: "Lecture deleted successfully" })
  } catch (error) {
    console.error('Error deleting lecture:', error)
    return res.status(500).json({ message: "Failed to delete lecture", error: error.message })
  }
}

export const uploadLectureVideo = async (req, res) => {
  try {
    const { lectureId, courseId } = req.params
    
    console.log('Upload video request received')
    console.log('Lecture ID:', lectureId)
    console.log('Course ID:', courseId)
    console.log('File:', req.file ? req.file.filename : 'No file')
    
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" })
    }

    // Validate lectureId and courseId
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ message: "Invalid lecture ID" })
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    // Check if lecture exists and belongs to the course
    const lecture = await Lecture.findById(lectureId)
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" })
    }

    if (lecture.courseId.toString() !== courseId) {
      return res.status(403).json({ message: "Lecture does not belong to this course" })
    }

    console.log('Uploading to Cloudinary...')
    // Upload to Cloudinary
    const videoUrl = await uploadToCloudinary(req.file, 'lms_videos')

    console.log('Video uploaded successfully:', videoUrl)

    return res.status(200).json({ 
      message: "Video uploaded successfully",
      videoUrl: videoUrl
    })
  } catch (error) {
    console.error('Error uploading video:', error)
    return res.status(500).json({ message: "Failed to upload video", error: error.message })
  }
}
