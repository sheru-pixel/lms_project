import express from "express";
import { 
  initiatePayment, 
  processbKashPayment, 
  verifyPayment, 
  getPaymentHistory, 
  checkEnrollment 
} from "../contollers/paymentController.js";
import isAuth from "../middleware/isauth.js";

const paymentRouter = express.Router();

// Initiate payment
paymentRouter.post("/initiate", isAuth, initiatePayment);

// Process bKash payment
paymentRouter.post("/bkash", isAuth, processbKashPayment);

// Verify payment
paymentRouter.get("/verify/:paymentId", isAuth, verifyPayment);

// Get payment history
paymentRouter.get("/history", isAuth, getPaymentHistory);

// Check enrollment status
paymentRouter.get("/check-enrollment/:courseId", isAuth, checkEnrollment);

export default paymentRouter;
