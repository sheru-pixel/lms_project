import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "USD"
  },
  paymentMethod: {
    type: String,
    enum: ["bkash", "credit_card", "other"],
    default: "bkash"
  },
  transactionId: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled"],
    default: "pending"
  },
  paymentDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
