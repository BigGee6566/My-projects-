const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  residence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Residence',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'double'],
    required: true
  },
  numberOfBeds: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  price: {
    type: Number,
    required: true
  },
  allowedGender: {
    type: String,
    enum: ['male', 'female', 'any'],
    default: 'any'
  },
  isAccessible: {
    type: Boolean,
    default: false // For disability access
  },
  floorRestrictions: {
    femaleOnly: {
      type: Boolean,
      default: false
    },
    disabilityAccess: {
      type: Boolean,
      default: false
    },
    groundFloorOnly: {
      type: Boolean,
      default: false
    }
  },
  occupants: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    allocatedDate: {
      type: Date,
      default: Date.now
    }
  }],
  isOccupied: {
    type: Boolean,
    default: false
  },
  isFull: {
    type: Boolean,
    default: false
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String // File paths
  }],
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update room status based on occupants
roomSchema.pre('save', function(next) {
  this.isOccupied = this.occupants.length > 0;
  this.isFull = this.occupants.length >= this.numberOfBeds;
  next();
});

// Check if room is suitable for student based on gender and disability
roomSchema.methods.isSuitableForStudent = function(student) {
  // Check gender restrictions
  if (this.allowedGender !== 'any' && this.allowedGender !== student.gender) {
    return false;
  }

  // Check floor restrictions for females
  if (this.floorRestrictions.femaleOnly && student.gender !== 'female') {
    return false;
  }

  // Check ground floor requirement for disability
  if (student.hasDisability && !this.floorRestrictions.disabilityAccess && this.floor !== 0) {
    return false;
  }

  // Check if room has disability access when needed
  if (student.hasDisability && !this.isAccessible) {
    return false;
  }

  return true;
};

module.exports = mongoose.model('Room', roomSchema);