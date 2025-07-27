const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is a student
const requireStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Student access required' });
  }
  next();
};

// Check if user is a landlord
const requireLandlord = (req, res, next) => {
  if (req.user.role !== 'landlord') {
    return res.status(403).json({ message: 'Landlord access required' });
  }
  next();
};

// Check if user is verified (for landlords)
const requireVerified = (req, res, next) => {
  if (req.user.role === 'landlord' && !req.user.isVerified) {
    return res.status(403).json({ message: 'Account verification required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireStudent,
  requireLandlord,
  requireVerified
};