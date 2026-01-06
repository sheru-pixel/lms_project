import Payment from "../model/paymentModel.js";
import Enrollment from "../model/enrollmentModel.js";
import User from "../model/userModel.js";
import Course from "../model/courseModel.js";

// Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.userId;

    if (!courseId || amount === undefined) {
      return res.status(400).json({
        message: "Course ID and amount are required",
        success: false,
      });
    }

    // Create a pending payment record
    const payment = new Payment({
      studentId: userId,
      courseId: courseId,
      amount: amount,
      paymentMethod: "bkash",
      status: "pending",
      transactionId: null,
      expiryDate: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    });

    await payment.save();

    return res.status(201).json({
      message: "Payment initiated successfully",
      success: true,
      paymentId: payment._id,
      amount: payment.amount,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json({
      message: "Error initiating payment",
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
};

// Process bKash Payment
export const processbKashPayment = async (req, res) => {
  try {
    const { paymentId, bkashNumber, bkashPin } = req.body;
    const userId = req.userId;

    if (!paymentId || !bkashNumber || !bkashPin) {
      return res.status(400).json({
        message: "Payment ID, bKash number, and PIN are required",
        success: false,
      });
    }

    // Validate bKash number (11 digits starting with 01)
    if (!/^01\d{9}$/.test(bkashNumber)) {
      return res.status(400).json({
        message: "Invalid bKash number. Must be 11 digits starting with 01",
        success: false,
      });
    }

    // Validate PIN (4 or more digits)
    if (!/^\d{4,}$/.test(bkashPin)) {
      return res.status(400).json({
        message: "Invalid PIN. Must be 4 or more digits",
        success: false,
      });
    }

    // Find the payment record
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
        success: false,
      });
    }

    // Check if payment has expired
    if (new Date() > payment.expiryDate) {
      return res.status(400).json({
        message: "Payment session expired",
        success: false,
      });
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Update payment status
    payment.status = "completed";
    payment.transactionId = transactionId;
    payment.paymentDate = new Date();
    await payment.save();

    // Create enrollment record
    const enrollment = new Enrollment({
      studentId: userId,
      courseId: payment.courseId,
      paymentId: payment._id,
      status: "active",
    });

    await enrollment.save();

    // Update user's enrolledCourses array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: payment.courseId } },
      { new: true }
    );

    // Update course's enrolledStudents array
    await Course.findByIdAndUpdate(
      payment.courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );

    return res.status(200).json({
      message: "Payment processed successfully",
      success: true,
      transactionId: transactionId,
      enrolled: true,
    });
  } catch (error) {
    console.error("Error processing bKash payment:", error);
    return res.status(500).json({
      message: "Error processing payment",
      success: false,
      error: error.message,
    });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Payment verified",
      success: true,
      status: payment.status,
      transactionId: payment.transactionId,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      message: "Error verifying payment",
      success: false,
      error: error.message,
    });
  }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const payments = await Payment.find({ studentId: userId })
      .populate("courseId", "courseTitle price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Payment history retrieved",
      success: true,
      payments: payments,
    });
  } catch (error) {
    console.error("Error getting payment history:", error);
    return res.status(500).json({
      message: "Error retrieving payment history",
      success: false,
      error: error.message,
    });
  }
};

// Check Enrollment Status
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const enrollment = await Enrollment.findOne({
      studentId: userId,
      courseId: courseId,
      status: "active",
    });

    return res.status(200).json({
      message: "Enrollment status checked",
      success: true,
      enrolled: !!enrollment,
    });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return res.status(500).json({
      message: "Error checking enrollment",
      success: false,
      error: error.message,
    });
  }
};
