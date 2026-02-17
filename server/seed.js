const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Demo users data
const demoUsers = [
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'password',
    role: 'manager'
  },
  {
    name: 'Employee User',
    email: 'employee@example.com',
    password: 'password',
    role: 'employee'
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password',
    role: 'employee'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password',
    role: 'employee'
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geotracking')
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed function
async function seedDatabase() {
  try {
    console.log('Clearing existing users...');
    await User.deleteMany({});
    
    console.log('Creating demo users...');
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.name} (${user.email}) - ${user.role}`);
    }
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('------------------');
    console.log('Manager: manager@example.com / password');
    console.log('Employee: employee@example.com / password');
    console.log('Employee: john@example.com / password');
    console.log('Employee: sarah@example.com / password');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run seed
seedDatabase();
