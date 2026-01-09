import mongoose from "mongoose";

const availabilitySlotSchema = new mongoose.Schema({
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
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  status: {
    type: String,
    enum: ["available", "booked", "cancelled"],
    default: "available"
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

const AvailabilitySlot = mongoose.model("AvailabilitySlot", availabilitySlotSchema);
export default AvailabilitySlot;
