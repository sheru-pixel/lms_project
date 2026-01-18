import mongoose from 'mongoose';
import Course from '../model/courseModel.js';
import User from '../model/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function assignCoursesToQwert() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Find all users to see what we have
    console.log('\n=== All Users ===');
    const allUsers = await User.find({});
    allUsers.forEach(u => {
      console.log(`- ${u._id} | name: ${u.name} | email: ${u.email} | role: ${u.role}`);
    });

    // Find the qwert user by different fields
    let educator = await User.findOne({ name: 'qwert' });
    if (!educator) {
      educator = await User.findOne({ email: { $regex: /qwert/i } });
    }
    if (!educator) {
      educator = await User.findOne({ userName: 'qwert' });
    }

    if (!educator) {
      console.log('\n❌ qwert educator not found!');
      console.log('Please check which educator account you used to create courses');
      await mongoose.disconnect();
      return;
    }

    console.log('\n✅ Found qwert educator:', educator._id, educator.name, educator.email);

    // Show courses before update
    console.log('\n=== Courses Before Update ===');
    let courses = await Course.find({});
    courses.forEach(c => {
      console.log(`- ${c._id} | ${c.title} | educator: ${c.educator || 'undefined'}`);
    });

    // Update all courses to assign to qwert
    const result = await Course.updateMany(
      {},
      { educator: educator._id }
    );

    console.log('\n✅ Updated', result.modifiedCount, 'courses');

    // Show courses after update
    console.log('\n=== Courses After Update ===');
    courses = await Course.find({}).populate('educator', 'name email');
    courses.forEach(c => {
      console.log(`- ${c._id} | ${c.title} | educator: ${c.educator?.name || 'none'}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done! Courses should now appear in educator dashboard');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

assignCoursesToQwert();
