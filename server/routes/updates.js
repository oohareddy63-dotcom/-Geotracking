const express = require('express');
const WorkUpdate = require('../models/WorkUpdate');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const { isWithinGeoFence } = require('../utils/geo');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get work updates (manager sees all, employee sees own)
router.get('/', authenticate, async (req, res) => {
  try {
    let updates;
    if (req.user.role === 'manager') {
      updates = await WorkUpdate.find()
        .populate('taskId', 'title')
        .populate('employeeId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      updates = await WorkUpdate.find({ employeeId: req.user.userId })
        .populate('taskId', 'title')
        .sort({ createdAt: -1 });
    }
    res.json(updates);
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit work update (employee only)
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { taskId, description, completionPercentage, latitude, longitude, proofImages } = req.body;

    // Check if task exists and is assigned to user
    const task = await Task.findOne({ _id: taskId, assignedTo: req.user.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not assigned to you' });
    }

    // Check geo-fence
    const isGeoVerified = isWithinGeoFence(
      latitude, longitude,
      task.location.latitude, task.location.longitude,
      task.geoFenceRadius
    );

    const update = new WorkUpdate({
      taskId,
      employeeId: req.user.userId,
      description,
      completionPercentage,
      location: { latitude, longitude },
      isGeoVerified,
      proofImages: proofImages || []
    });

    await update.save();

    // Update task completion percentage
    task.completionPercentage = completionPercentage;
    if (completionPercentage === 100) {
      task.status = 'completed';
    }
    await task.save();

    await update.populate('taskId', 'title');
    await update.populate('employeeId', 'name email');

    res.status(201).json(update);
  } catch (error) {
    console.error('Submit update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject update (manager only)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, managerComments } = req.body;
    const update = await WorkUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    update.status = status;
    if (managerComments) {
      update.managerComments = managerComments;
    }

    await update.save();
    res.json(update);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check-in/Check-out for attendance
router.post('/attendance', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { taskId, type, latitude, longitude } = req.body; // type: 'checkin' or 'checkout'

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employeeId: req.user.userId,
      date: today
    });

    if (type === 'checkin') {
      if (attendance) {
        return res.status(400).json({ message: 'Already checked in today' });
      }

      attendance = new Attendance({
        employeeId: req.user.userId,
        taskId,
        checkInTime: new Date(),
        checkInLocation: { latitude, longitude },
        date: today
      });
    } else if (type === 'checkout') {
      if (!attendance || attendance.status === 'completed') {
        return res.status(400).json({ message: 'No active check-in found' });
      }

      attendance.checkOutTime = new Date();
      attendance.checkOutLocation = { latitude, longitude };
      attendance.status = 'completed';

      // Calculate total hours
      const diff = attendance.checkOutTime - attendance.checkInTime;
      attendance.totalHours = diff / (1000 * 60 * 60); // hours
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
