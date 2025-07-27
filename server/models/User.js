const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'landlord'],
    required: true
  },
  // Student specific fields
  studentNumber: {
    type: String,
    required: function() { return this.role === 'student'; },
    unique: true,
    sparse: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() { return this.role === 'student'; }
  },
  hasDisability: {
    type: Boolean,
    default: false,
    required: function() { return this.role === 'student'; }
  },
  // Landlord specific fields
  residenceName: {
    type: String,
    required: function() { return this.role === 'landlord'; }
  },
  location: {
    type: String,
    required: function() { return this.role === 'landlord'; }
  },
  proofOfResidence: {
    type: String, // File path
    required: function() { return this.role === 'landlord'; }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  allocatedRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
  applicationStatus: {
    type: String,
    enum: ['none', 'pending', 'accepted', 'allocated'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);