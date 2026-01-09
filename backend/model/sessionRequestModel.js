import mongoose from "mongoose";

const sessionRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  educator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  availabilitySlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AvailabilitySlot",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed", "cancelled"],
    default: "pending"
  },
  requestMessage: {
    type: String,
    default: ""
  },
  rejectionReason: {
    type: String,
    default: null
  },
  sessionStartTime: {
    type: Date,
    required: true
  },
  sessionEndTime: {
    type: Date,
    required: true
  },
  meetingLink: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const SessionRequest = mongoose.model("SessionRequest", sessionRequestSchema);
export default SessionRequest;
