const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  checkInLocation: {
    latitude: Number,
    longitude: Number
  },
  checkOutLocation: {
    latitude: Number,
    longitude: Number
  },
  totalHours: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
attendanceSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
