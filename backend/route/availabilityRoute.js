import express from "express";
import isAuth from "../middleware/isauth.js";
import {
  createAvailabilitySlot,
  getEducatorAvailabilitySlots,
  getAvailableSlotsByCourse,
  updateAvailabilitySlot,
  deleteAvailabilitySlot
} from "../contollers/availabilityController.js";

const router = express.Router();

// Educator routes
router.post("/create", isAuth, createAvailabilitySlot);
router.get("/educator/slots", isAuth, getEducatorAvailabilitySlots);
router.put("/update/:slotId", isAuth, updateAvailabilitySlot);
router.delete("/delete/:slotId", isAuth, deleteAvailabilitySlot);

// Student routes
router.get("/course/:courseId", getAvailableSlotsByCourse);

export default router;
