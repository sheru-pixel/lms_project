import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,   
    required: true,
  },
  videoUrl: {
    type: String,
    default: "",
  },
  duration: {
    type: String,
    default: "0 mins"
  },
  description: {
    type: String,
    default: ""
  },
  isPreviewfree: {
    type: Boolean,
    default: false,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
}, { timestamps: true });

const Lecture = mongoose.model('Lecture', lectureSchema);

export default Lecture;