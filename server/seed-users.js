const mongoose = require('mongoose');
const User = require('./models/User');

// Sample users to seed
const sampleUsers = [
  {
    name: 'Manager',
    email: 'manager@example.com',
    password: 'password',
    role: 'manager'
  },
  {
    name: 'Employee',
    email: 'employee@example.com', 
    password: 'password',
    role: 'employee'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password', 
    role: 'employee'
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password',
    role: 'employee'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geotracking');

    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log('Sample users created:', users.length);
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedUsers();
