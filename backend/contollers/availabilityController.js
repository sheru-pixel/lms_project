import AvailabilitySlot from "../model/availabilitySlotModel.js";
import User from "../model/userModel.js";
import Course from "../model/courseModel.js";

// Educator: Create availability slot
export const createAvailabilitySlot = async (req, res) => {
  try {
    const { startTime, endTime, courseId, notes } = req.body;
    const educatorId = req.userId;

    console.log("Creating availability slot:", { educatorId, courseId, startTime, endTime });

    // Validate times
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: "Start time must be before end time" });
    }

    if (new Date(startTime) < new Date()) {
      return res.status(400).json({ message: "Cannot create slots in the past" });
    }

    // Verify course exists and educator is the creator
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.educator.toString() !== educatorId) {
      return res.status(403).json({ message: "Unauthorized: Not course educator" });
    }

    const slot = await AvailabilitySlot.create({
      educator: educatorId,
      course: courseId,
      startTime,
      endTime,
      notes
    });

    console.log("Slot created successfully:", slot);

    await slot.populate("educator", "name email photoUrl");
    await slot.populate("course", "title");

    return res.status(201).json({
      message: "Availability slot created successfully",
      data: slot
    });
  } catch (error) {
    console.error("Error creating availability slot:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Educator: Get all availability slots for their courses
export const getEducatorAvailabilitySlots = async (req, res) => {
  try {
    const educatorId = req.userId;

    const slots = await AvailabilitySlot.find({ educator: educatorId })
      .populate("course", "title")
      .populate("bookedBy", "name email")
      .sort({ startTime: 1 });

    return res.status(200).json({
      message: "Availability slots retrieved successfully",
      data: slots
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Student: Get available slots for a specific course
export const getAvailableSlotsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    console.log("Fetching slots for course:", courseId);
    console.log("Current time:", new Date());

    // First, get all slots for this course
    const allSlots = await AvailabilitySlot.find({
      course: courseId
    })
      .populate("educator", "name email photoUrl description")
      .populate("course", "title")
      .sort({ startTime: 1 });

    console.log("All slots for course:", allSlots);

    // Filter for available slots that haven't ended
    const slots = allSlots.filter(slot => {
      const isAvailable = slot.status === "available";
      const notEnded = new Date(slot.endTime) > new Date();
      console.log(`Slot ${slot._id}: available=${isAvailable}, notEnded=${notEnded}, endTime=${slot.endTime}`);
      return isAvailable && notEnded;
    });

    console.log(`Filtered slots for course ${courseId}:`, slots);
    return res.status(200).json({
      message: "Available slots retrieved successfully",
      data: slots
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Educator: Update availability slot
export const updateAvailabilitySlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { startTime, endTime, notes, status } = req.body;
    const educatorId = req.userId;

    const slot = await AvailabilitySlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.educator.toString() !== educatorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (slot.isBooked && status === "cancelled") {
      return res.status(400).json({ message: "Cannot cancel a booked slot" });
    }

    if (startTime && endTime) {
      if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({ message: "Start time must be before end time" });
      }
      slot.startTime = startTime;
      slot.endTime = endTime;
    }

    if (notes !== undefined) slot.notes = notes;
    if (status) slot.status = status;

    await slot.save();
    await slot.populate("educator", "name email");
    await slot.populate("course", "title");

    return res.status(200).json({
      message: "Slot updated successfully",
      data: slot
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Educator: Delete availability slot
export const deleteAvailabilitySlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const educatorId = req.userId;

    const slot = await AvailabilitySlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.educator.toString() !== educatorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "Cannot delete a booked slot" });
    }

    await AvailabilitySlot.findByIdAndDelete(slotId);

    return res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
