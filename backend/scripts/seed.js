const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin already exists. Ensuring approval...');
      adminExists.isApproved = true;
      await adminExists.save();
      console.log('Admin approved successfully');
      process.exit();
    }

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'adminpassword', 
      role: 'admin',
      isApproved: true,
    });

    console.log('Admin created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: adminpassword');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
