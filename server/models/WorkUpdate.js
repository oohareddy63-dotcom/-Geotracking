const mongoose = require('mongoose');

const workUpdateSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completionPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  isGeoVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  managerComments: {
    type: String
  },
  proofImages: [{
    type: String // URLs or file paths
  }],
  timestamp: {
    type: Date,
    default: Date.now
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
workUpdateSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('WorkUpdate', workUpdateSchema);
