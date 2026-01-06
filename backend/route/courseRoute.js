import express from "express"
import isAuth from "../middleware/isauth.js"
import { getPublishedCourses, createCourse, getCreatorCourses, editCourse, getCourseById, removeCourse, getEnrolledCourses, isCourseFree } from "../contollers/coursecController.js"
import { createLecture, getLecturesByCourse, getLectureById, editLecture, deleteLecture, uploadLectureVideo } from "../contollers/lectureController.js"
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
courseRouter.delete("/:courseId/lecture/delete/:lectureId", isAuth, deleteLecture)
courseRouter.get("/:courseId/lectures", getLecturesByCourse)
courseRouter.get("/:courseId/lecture/:lectureId", getLectureById)
export default courseRouter