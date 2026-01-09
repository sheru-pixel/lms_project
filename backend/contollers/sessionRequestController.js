import SessionRequest from "../model/sessionRequestModel.js";
import AvailabilitySlot from "../model/availabilitySlotModel.js";
import User from "../model/userModel.js";
import Course from "../model/courseModel.js";

// Student: Request a session for an available slot
export const requestSession = async (req, res) => {
  try {
    const { slotId, requestMessage } = req.body;
    const studentId = req.userId;

    // Verify slot exists and is available
    const slot = await AvailabilitySlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    if (slot.status !== "available" || slot.isBooked) {
      return res.status(400).json({ message: "Slot is not available" });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(slot.course);
    if (!course.enrolledStudents.includes(studentId)) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    // Check if student already has a pending or approved request for this slot
    const existingRequest = await SessionRequest.findOne({
      student: studentId,
      availabilitySlot: slotId,
      status: { $in: ["pending", "approved"] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: "You already have a request for this slot" });
    }

    // Create session request
    const sessionRequest = await SessionRequest.create({
      student: studentId,
      educator: slot.educator,
      course: slot.course,
      availabilitySlot: slotId,
      requestMessage,
      sessionStartTime: slot.startTime,
      sessionEndTime: slot.endTime
    });

    await sessionRequest.populate("student", "name email photoUrl");
    await sessionRequest.populate("educator", "name email");
    await sessionRequest.populate("course", "title");
    await sessionRequest.populate("availabilitySlot");

    return res.status(201).json({
      message: "Session request created successfully",
      data: sessionRequest
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Educator: Get all session requests for their courses
export const getEducatorSessionRequests = async (req, res) => {
  try {
    const educatorId = req.userId;

    const requests = await SessionRequest.find({ educator: educatorId })
      .populate("student", "name email photoUrl")
      .populate("course", "title")
      .populate("availabilitySlot")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Session requests retrieved successfully",
      data: requests
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Educator: Approve session request
export const approveSessionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { meetingLink, notes } = req.body;
    const educatorId = req.userId;

    const request = await SessionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Session request not found" });
    }

    if (request.educator.toString() !== educatorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    // Update request status
    request.status = "approved";
    request.meetingLink = meetingLink || null;
    if (notes) request.notes = notes;

    // Update availability slot
    const slot = await AvailabilitySlot.findById(request.availabilitySlot);
    slot.isBooked = true;
    slot.status = "booked";
    slot.bookedBy = request.student;
    slot.meetingLink = meetingLink || null;

    await request.save();
    await slot.save();

    await request.populate("student", "name email photoUrl");
    await request.populate("educator", "name email");
    await request.populate("course", "title");

    return res.status(200).json({
      message: "Session request approved successfully",
      data: request
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Educator: Reject session request
export const rejectSessionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;
    const educatorId = req.userId;

    const request = await SessionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Session request not found" });
    }

    if (request.educator.toString() !== educatorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    request.status = "rejected";
    request.rejectionReason = rejectionReason || "Rejected by educator";

    await request.save();
    await request.populate("student", "name email photoUrl");
    await request.populate("educator", "name email");

    return res.status(200).json({
      message: "Session request rejected successfully",
      data: request
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Student: Get their session requests
export const getStudentSessionRequests = async (req, res) => {
  try {
    const studentId = req.userId;

    const requests = await SessionRequest.find({ student: studentId })
      .populate("educator", "name email photoUrl description")
      .populate("course", "title thumbnail")
      .populate("availabilitySlot")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Session requests retrieved successfully",
      data: requests
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Student: Cancel session request
export const cancelSessionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const studentId = req.userId;

    const request = await SessionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Session request not found" });
    }

    if (request.student.toString() !== studentId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status === "completed" || request.status === "cancelled") {
      return res.status(400).json({ message: "Cannot cancel this request" });
    }

    // If approved, release the slot
    if (request.status === "approved") {
      const slot = await AvailabilitySlot.findById(request.availabilitySlot);
      slot.isBooked = false;
      slot.status = "available";
      slot.bookedBy = null;
      await slot.save();
    }

    request.status = "cancelled";
    await request.save();

    return res.status(200).json({
      message: "Session request cancelled successfully",
      data: request
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single session request details
export const getSessionRequestDetail = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const request = await SessionRequest.findById(requestId)
      .populate("student", "name email photoUrl")
      .populate("educator", "name email photoUrl description")
      .populate("course", "title thumbnail")
      .populate("availabilitySlot");

    if (!request) {
      return res.status(404).json({ message: "Session request not found" });
    }

    // Check authorization
    if (request.student.toString() !== userId && request.educator.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      message: "Session request retrieved successfully",
      data: request
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
