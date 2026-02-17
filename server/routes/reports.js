const express = require('express');
const WorkUpdate = require('../models/WorkUpdate');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
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

// Get dashboard stats (manager only)
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Active employees (checked in today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeEmployees = await Attendance.find({
      date: today,
      status: 'active'
    }).countDocuments();

    // Task completion stats
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Pending updates
    const pendingUpdates = await WorkUpdate.countDocuments({ status: 'pending' });

    // Today's attendance
    const todaysAttendance = await Attendance.find({
      date: today
    }).populate('employeeId', 'name');

    res.json({
      activeEmployees,
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate),
      pendingUpdates,
      todaysAttendance
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee performance report
router.get('/performance/:employeeId', authenticate, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get work updates for the period
    const updates = await WorkUpdate.find({
      employeeId,
      createdAt: { $gte: start, $lte: end }
    }).populate('taskId', 'title');

    // Calculate performance metrics
    const totalUpdates = updates.length;
    const geoVerifiedUpdates = updates.filter(u => u.isGeoVerified).length;
    const approvedUpdates = updates.filter(u => u.status === 'approved').length;
    const onTimeUpdates = updates.filter(u => {
      // Simple on-time check (could be enhanced)
      return u.completionPercentage >= 50;
    }).length;

    const geoVerificationRate = totalUpdates > 0 ? (geoVerifiedUpdates / totalUpdates) * 100 : 0;
    const approvalRate = totalUpdates > 0 ? (approvedUpdates / totalUpdates) * 100 : 0;
    const onTimeRate = totalUpdates > 0 ? (onTimeUpdates / totalUpdates) * 100 : 0;

    // Calculate performance score (0-5 stars)
    const score = (geoVerificationRate + approvalRate + onTimeRate) / 60; // Average percentage / 20 for 5-star scale

    res.json({
      employeeId,
      period: { start, end },
      metrics: {
        totalUpdates,
        geoVerifiedUpdates,
        approvedUpdates,
        onTimeUpdates,
        geoVerificationRate: Math.round(geoVerificationRate),
        approvalRate: Math.round(approvalRate),
        onTimeRate: Math.round(onTimeRate),
        performanceScore: Math.min(5, Math.max(0, Math.round(score)))
      },
      updates
    });
  } catch (error) {
    console.error('Performance report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily/weekly reports
router.get('/summary', authenticate, async (req, res) => {
  try {
    const { type = 'daily', date } = req.query; // type: 'daily' or 'weekly'
    const reportDate = date ? new Date(date) : new Date();

    let startDate, endDate;

    if (type === 'daily') {
      startDate = new Date(reportDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else {
      // Weekly (Monday to Sunday)
      const day = reportDate.getDay();
      const diff = reportDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
      startDate = new Date(reportDate.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
    }

    // Get attendance for the period
    const attendance = await Attendance.find({
      date: { $gte: startDate, $lt: endDate }
    }).populate('employeeId', 'name');

    // Get work updates for the period
    const updates = await WorkUpdate.find({
      createdAt: { $gte: startDate, $lt: endDate }
    }).populate('employeeId', 'name').populate('taskId', 'title');

    // Calculate summary stats
    const totalEmployees = new Set(attendance.map(a => a.employeeId._id.toString())).size;
    const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);
    const totalUpdates = updates.length;
    const approvedUpdates = updates.filter(u => u.status === 'approved').length;

    res.json({
      type,
      period: { startDate, endDate },
      summary: {
        totalEmployees,
        totalHours: Math.round(totalHours * 100) / 100,
        totalUpdates,
        approvedUpdates,
        approvalRate: totalUpdates > 0 ? Math.round((approvedUpdates / totalUpdates) * 100) : 0
      },
      attendance,
      updates
    });
  } catch (error) {
    console.error('Summary report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
