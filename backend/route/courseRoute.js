import express from "express"
import isAuth from "../middleware/isauth.js"
import { getPublishedCourses, createCourse, getCreatorCourses, editCourse, getCourseById, removeCourse, getEnrolledCourses, isCourseFree } from "../contollers/coursecController.js"
import { createLecture, getLecturesByCourse, getLectureById, editLecture, deleteLecture, uploadLectureVideo, uploadLectureNotes, uploadTaskPdf, uploadResource, deleteResource } from "../contollers/lectureController.js"
import { addReview, getReviews, updateReview, deleteReview } from "../contollers/reviewController.js"
import upload from "../middleware/multer.js"
const courseRouter = express.Router()

// Specific routes (must come before :courseId routes)
courseRouter.post("/create", isAuth, createCourse)
courseRouter.get("/getpublished", getPublishedCourses)
courseRouter.get("/getcreatorcourses", isAuth, getCreatorCourses)
courseRouter.get("/enrolled", isAuth, getEnrolledCourses)

// Course detail routes
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRouter.get("/getcourse/:courseId", getCourseById)
courseRouter.get("/is-free/:courseId", isCourseFree)
courseRouter.delete("/remove/:courseId", isAuth, removeCourse)

// Lecture routes under course (these come after specific course routes)
courseRouter.post("/:courseId/lecture/create", isAuth, createLecture)
courseRouter.post("/:courseId/lecture/edit/:lectureId", isAuth, editLecture)
courseRouter.post("/:courseId/lecture/upload-video/:lectureId", isAuth, upload.single("video"), uploadLectureVideo)
courseRouter.post("/:courseId/lecture/upload-notes/:lectureId", isAuth, upload.single("notes"), uploadLectureNotes)
courseRouter.post("/:courseId/lecture/upload-task/:lectureId", isAuth, upload.single("task"), uploadTaskPdf)
courseRouter.post("/:courseId/lecture/:lectureId/upload-resource", isAuth, upload.single("resource"), uploadResource)
courseRouter.delete("/:courseId/lecture/:lectureId/delete-resource/:resourceIndex", isAuth, deleteResource)
courseRouter.delete("/:courseId/lecture/delete/:lectureId", isAuth, deleteLecture)
courseRouter.get("/:courseId/lectures", getLecturesByCourse)
courseRouter.get("/:courseId/lecture/:lectureId", getLectureById)

// Review routes
courseRouter.post("/:courseId/review", isAuth, addReview)
courseRouter.get("/:courseId/reviews", getReviews)
courseRouter.put("/:courseId/review/:reviewId", isAuth, updateReview)
courseRouter.delete("/:courseId/review/:reviewId", isAuth, deleteReview)

export default courseRouter