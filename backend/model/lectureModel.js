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
  lectureNotes: {
    type: String,
    default: ""
  },
  taskPdf: {
    type: String,
    default: ""
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'other'],
      default: 'pdf'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const Lecture = mongoose.model('Lecture', lectureSchema);

export default Lecture;