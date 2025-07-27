const mongoose = require('mongoose');

const residenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String // File paths
  }],
  priceRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  totalRooms: {
    type: Number,
    default: 0
  },
  occupiedRooms: {
    type: Number,
    default: 0
  },
  availableRooms: {
    type: Number,
    default: 0
  },
  floorPlan: {
    type: String // File path
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  rules: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update available rooms when total or occupied changes
residenceSchema.pre('save', function(next) {
  this.availableRooms = this.totalRooms - this.occupiedRooms;
  next();
});

module.exports = mongoose.model('Residence', residenceSchema);