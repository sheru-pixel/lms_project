import mongoose from 'mongoose';
import AvailabilitySlot from './model/availabilitySlotModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkSlots() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all slots
    const allSlots = await AvailabilitySlot.find({});
    console.log("Total slots in database:", allSlots.length);
    console.log("Slots:", JSON.stringify(allSlots, null, 2));

    // Get slots with details
    const slotsWithDetails = await AvailabilitySlot.find({})
      .populate("educator", "name email")
      .populate("course", "title");
    console.log("\nSlots with details:", JSON.stringify(slotsWithDetails, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkSlots();
