const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  residence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Residence',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'allocated'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  responseDate: {
    type: Date
  },
  allocationDate: {
    type: Date
  },
  notes: {
    type: String
  },
  priority: {
    type: Number,
    default: 0 // Higher number = higher priority
  },
  fundingType: {
    type: String,
    enum: ['nsfas', 'self-funded'],
    required: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalInfo: {
    allergies: String,
    medications: String,
    specialNeeds: String
  },
  previousResidence: {
    name: String,
    reason: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
applicationSchema.index({ student: 1, residence: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ applicationDate: 1 });

module.exports = mongoose.model('Application', applicationSchema);