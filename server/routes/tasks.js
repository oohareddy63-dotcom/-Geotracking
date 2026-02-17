const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const User = require('../models/User');
const { isWithinGeoFence } = require('../utils/geo');

const router = express.Router();

// Middleware to verify JWT (simple for demo)
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

// Get all tasks (for manager) or assigned tasks (for employee)
router.get('/', authenticate, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'manager') {
      tasks = await Task.find().populate('assignedTo', 'name email').populate('assignedBy', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user.userId }).populate('assignedBy', 'name');
    }
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task (manager only)
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, assignedTo, location, geoFenceRadius, priority, deadline } = req.body;

    // Validate that assignedTo is a valid ObjectId if provided
    let assignedToId = assignedTo;
    if (assignedTo && typeof assignedTo === 'string' && assignedTo.trim() !== '') {
      // Verify it's a valid ObjectId format
      if (!require('mongoose').Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: 'Invalid employee ID format' });
      }
      assignedToId = require('mongoose').Types.ObjectId(assignedTo);
    } else {
      assignedToId = undefined; // Allow unassigned tasks
    }

    const task = new Task({
      title,
      description,
      assignedTo: assignedToId,
      assignedBy: req.user.userId,
      location,
      geoFenceRadius,
      priority,
      deadline
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        task[key] = updates[key];
      }
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task (manager only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
