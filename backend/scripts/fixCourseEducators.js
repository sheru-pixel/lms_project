import mongoose from 'mongoose';
import Course from '../model/courseModel.js';
import User from '../model/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixCourseEducators() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Find the qwert educator
    const educator = await User.findOne({ 
      $or: [
        { name: 'qwert' },
        { email: { $regex: /qwert/i } },
        { userName: 'qwert' }
      ]
    });

    if (!educator) {
      console.log('qwert educator not found');
      console.log('Available educators:');
      const allEducators = await User.find({ role: 'educator' });
      allEducators.forEach(e => {
        console.log(`- ${e.name || 'unnamed'} (${e.email})`);
      });
      await mongoose.disconnect();
      return;
    }

    console.log('Found qwert educator:', educator._id, educator.email);

    // Update all courses with null educator to have this educator
    const result = await Course.updateMany(
      { $or: [{ educator: null }, { educator: undefined }, { educator: { $exists: false } }] },
      { educator: educator._id }
    );

    console.log('Updated courses:', result.modifiedCount);

    // Show all courses and their educators
    const allCourses = await Course.find({}).populate('educator', 'name email');
    console.log('All courses after update:');
    allCourses.forEach(c => {
      console.log(`- ${c.title} (educator: ${c.educator?.email || 'none'})`);
    });

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixCourseEducators();
