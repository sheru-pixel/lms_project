import express from "express"
import isAuth from "../middleware/isauth.js"
import {
  createLecture,
  getLecturesByCourse,
  getLectureById,
  editLecture,
  deleteLecture
} from "../contollers/lectureController.js"

const lectureRouter = express.Router()

lectureRouter.post("/create", isAuth, createLecture)
lectureRouter.get("/course/:courseId", getLecturesByCourse)
lectureRouter.get("/:lectureId", getLectureById)
lectureRouter.post("/edit/:lectureId", isAuth, editLecture)
lectureRouter.delete("/delete/:lectureId", isAuth, deleteLecture)

export default lectureRouter
