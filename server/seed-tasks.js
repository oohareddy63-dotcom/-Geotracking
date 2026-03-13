const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geotracking')
.then(() => console.log('MongoDB connected for seeding tasks'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed function
async function seedTasks() {
  try {
    // Get manager and employees
    const manager = await User.findOne({ role: 'manager' });
    const employees = await User.find({ role: 'employee' });

    if (!manager || employees.length === 0) {
      console.log('Please run seed.js first to create users');
      process.exit(1);
    }

    console.log('Clearing existing tasks...');
    await Task.deleteMany({});

    // Sample tasks with different locations
    const sampleTasks = [
      {
        title: 'Client Meeting at Downtown Office',
        description: 'Meet with client to discuss project requirements and timeline',
        assignedTo: employees[0]._id,
        assignedBy: manager._id,
        location: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        geoFenceRadius: 200,
        status: 'pending',
        priority: 'high',
        completionPercentage: 0
      },
      {
        title: 'Site Inspection - Construction Area',
        description: 'Inspect construction site and report progress',
        assignedTo: employees[1]._id,
        assignedBy: manager._id,
        location: {
          latitude: 40.7589,
          longitude: -73.9851
        },
        geoFenceRadius: 300,
        status: 'in_progress',
        priority: 'medium',
        completionPercentage: 45
      },
      {
        title: 'Equipment Delivery - Warehouse',
        description: 'Deliver equipment to warehouse and get signature',
        assignedTo: employees[0]._id,
        assignedBy: manager._id,
        location: {
          latitude: 40.7489,
          longitude: -73.9680
        },
        geoFenceRadius: 250,
        status: 'pending',
        priority: 'medium',
        completionPercentage: 0
      },
      {
        title: 'Customer Support Visit',
        description: 'Visit customer location to resolve technical issues',
        assignedTo: employees[2]._id,
        assignedBy: manager._id,
        location: {
          latitude: 40.7614,
          longitude: -73.9776
        },
        geoFenceRadius: 200,
        status: 'pending',
        priority: 'high',
        completionPercentage: 0
      },
      {
        title: 'Inventory Check - Store Location',
        description: 'Perform inventory audit at retail store',
        assignedTo: employees[1]._id,
        assignedBy: manager._id,
        location: {
          latitude: 40.7580,
          longitude: -73.9855
        },
        geoFenceRadius: 150,
        status: 'completed',
        priority: 'low',
        completionPercentage: 100
      }
    ];

    console.log('Creating sample tasks...');
    for (const taskData of sampleTasks) {
      const task = new Task(taskData);
      await task.save();
      console.log(`Created task: ${task.title} - assigned to ${taskData.assignedTo}`);
    }

    console.log('\n✅ Tasks seeded successfully!');
    console.log(`Created ${sampleTasks.length} sample tasks`);

  } catch (error) {
    console.error('Error seeding tasks:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run seed
seedTasks();
