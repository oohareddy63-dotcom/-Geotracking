const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');
const Attendance = require('./models/Attendance');
const WorkUpdate = require('./models/WorkUpdate');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geotracking')
.then(() => console.log('MongoDB connected for data generation'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const sampleTasks = [
  {
    title: 'Office Cleaning',
    description: 'Clean all office areas, empty trash bins, and mop floors',
    assignedTo: null, // Will be assigned later
    assignedBy: null, // Will be assigned later
    location: { latitude: 40.7128, longitude: -74.0060 }, // NYC coordinates
    geoFenceRadius: 100,
    status: 'in_progress',
    priority: 'medium',
    completionPercentage: 65
  },
  {
    title: 'Client Meeting',
    description: 'Meet with Johnson & Associates for quarterly review',
    assignedTo: null,
    assignedBy: null,
    location: { latitude: 40.7589, longitude: -73.9851 }, // Times Square
    geoFenceRadius: 150,
    status: 'pending',
    priority: 'high',
    completionPercentage: 0
  },
  {
    title: 'Warehouse Inventory',
    description: 'Count and record inventory in warehouse section A',
    assignedTo: null,
    assignedBy: null,
    location: { latitude: 40.7505, longitude: -73.9934 }, // Midtown
    geoFenceRadius: 200,
    status: 'completed',
    priority: 'medium',
    completionPercentage: 100
  },
  {
    title: 'Equipment Maintenance',
    description: 'Service and inspect all machinery in workshop',
    assignedTo: null,
    assignedBy: null,
    location: { latitude: 40.7282, longitude: -74.0776 }, // Jersey City
    geoFenceRadius: 125,
    status: 'in_progress',
    priority: 'high',
    completionPercentage: 30
  }
];

const sampleAttendances = [
  {
    employeeId: null, // Will be assigned later
    taskId: null, // Will be assigned later
    checkInTime: new Date(Date.now() - 86400000), // 24 hours ago
    checkInLocation: { latitude: 40.7128, longitude: -74.0060 },
    date: new Date(Date.now() - 86400000),
    status: 'completed'
  },
  {
    employeeId: null, // Will be assigned later
    taskId: null,
    checkInTime: new Date(Date.now() - 3600000), // 1 hour ago
    checkInLocation: { latitude: 40.7589, longitude: -73.9851 },
    date: new Date(Date.now() - 3600000),
    status: 'active'
  }
];

const sampleWorkUpdates = [
  {
    taskId: null, // Will be assigned later
    employeeId: null, // Will be assigned later
    description: 'Completed initial cleaning of reception area',
    completionPercentage: 25,
    location: { latitude: 40.7128, longitude: -74.0060 },
    isGeoVerified: true,
    status: 'pending',
    timestamp: new Date(Date.now() - 7200000) // 2 hours ago
  },
  {
    taskId: null,
    employeeId: null,
    description: 'Finished mopping all office floors',
    completionPercentage: 100,
    location: { latitude: 40.7128, longitude: -74.0060 },
    isGeoVerified: true,
    status: 'approved',
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    taskId: null,
    employeeId: null,
    description: 'Arrived at client location, preparing for meeting',
    completionPercentage: 10,
    location: { latitude: 40.7589, longitude: -73.9851 },
    isGeoVerified: true,
    status: 'pending',
    timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
  }
];

async function generateSampleData() {
  try {
    console.log('Deleting existing sample data...');
    await Task.deleteMany({});
    await Attendance.deleteMany({});
    await WorkUpdate.deleteMany({});

    // Get users to assign tasks to
    const users = await User.find({});
    if (users.length === 0) {
      console.log('No users found. Please run seed.js first.');
      return;
    }

    // Assign tasks to employees
    const employees = users.filter(user => user.role === 'employee');
    const managers = users.filter(user => user.role === 'manager');

    if (employees.length === 0) {
      console.log('No employees found to assign tasks to.');
      return;
    }

    if (managers.length === 0) {
      console.log('No managers found to assign tasks from.');
      return;
    }

    console.log('Creating sample tasks...');
    for (let i = 0; i < sampleTasks.length; i++) {
      const taskData = { ...sampleTasks[i] };
      taskData.assignedTo = employees[i % employees.length]._id;
      taskData.assignedBy = managers[0]._id; // Use first manager
      
      const newTask = new Task({
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assignedTo,
        assignedBy: taskData.assignedBy,
        location: taskData.location,
        geoFenceRadius: taskData.geoFenceRadius,
        status: taskData.status,
        priority: taskData.priority,
        completionPercentage: taskData.completionPercentage
      });
      
      await newTask.save();
      console.log(`Created task: ${newTask.title}`);
    }

    console.log('Creating sample attendances...');
    const tasks = await Task.find({});
    for (let i = 0; i < sampleAttendances.length; i++) {
      const attendanceData = { ...sampleAttendances[i] };
      attendanceData.employeeId = employees[i % employees.length]._id;
      attendanceData.taskId = tasks[i % tasks.length]._id;
      
      const newAttendance = new Attendance({
        employeeId: attendanceData.employeeId,
        taskId: attendanceData.taskId,
        checkInTime: attendanceData.checkInTime,
        checkInLocation: attendanceData.checkInLocation,
        date: attendanceData.date,
        status: attendanceData.status
      });
      
      await newAttendance.save();
      console.log(`Created attendance for employee at ${newAttendance.checkInLocation.latitude}, ${newAttendance.checkInLocation.longitude}`);
    }

    console.log('Creating sample work updates...');
    for (let i = 0; i < sampleWorkUpdates.length; i++) {
      const updateData = { ...sampleWorkUpdates[i] };
      updateData.employeeId = employees[i % employees.length]._id;
      updateData.taskId = tasks[i % tasks.length]._id;
      
      const newUpdate = new WorkUpdate({
        taskId: updateData.taskId,
        employeeId: updateData.employeeId,
        description: updateData.description,
        completionPercentage: updateData.completionPercentage,
        location: updateData.location,
        isGeoVerified: updateData.isGeoVerified,
        status: updateData.status,
        timestamp: updateData.timestamp
      });
      
      await newUpdate.save();
      console.log(`Created work update: ${newUpdate.description.substring(0, 30)}...`);
    }

    console.log('\n✅ Sample data generated successfully!');
    console.log(`\n📊 Data Summary:`);
    console.log(`- Tasks: ${sampleTasks.length}`);
    console.log(`- Attendances: ${sampleAttendances.length}`);
    console.log(`- Work Updates: ${sampleWorkUpdates.length}`);
    console.log(`\n📋 Demo Users:`);
    employees.forEach(emp => {
      console.log(`- Employee: ${emp.name} (${emp.email})`);
    });
    managers.forEach(man => {
      console.log(`- Manager: ${man.name} (${man.email})`);
    });

  } catch (error) {
    console.error('Error generating sample data:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run data generation
generateSampleData();