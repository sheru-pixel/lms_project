import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  subTitle:{
    type:String
  },
  description:{
    type:String
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"]
  },
  price: {
    type: Number,
    default: 0
  },
  originalPrice: {
    type: Number
  },
  duration: {
    type: String,
    default: "0 hours"
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture"
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  reviewsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]

},{timestamps:true})


const Course = mongoose.model("Course",courseSchema)

export default Course
