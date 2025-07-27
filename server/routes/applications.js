const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const User = require('../models/User');
const Residence = require('../models/Residence');
const Room = require('../models/Room');
const { authenticateToken, requireStudent, requireLandlord } = require('../middleware/auth');

const router = express.Router();

// Auto-allocation algorithm
const autoAllocateRoom = async (application) => {
  try {
    const student = await User.findById(application.student);
    const residence = await Residence.findById(application.residence);

    if (!student || !residence) return null;

    // Find suitable rooms
    const availableRooms = await Room.find({
      residence: residence._id,
      isActive: true,
      isFull: false
    });

    // Filter rooms based on student requirements
    const suitableRooms = availableRooms.filter(room => 
      room.isSuitableForStudent(student)
    );

    if (suitableRooms.length === 0) return null;

    // Priority: 
    // 1. Ground floor for disability
    // 2. Same gender restrictions
    // 3. Single rooms first, then double
    const prioritizedRooms = suitableRooms.sort((a, b) => {
      // Disability priority - ground floor first
      if (student.hasDisability) {
        if (a.floor === 0 && b.floor !== 0) return -1;
        if (a.floor !== 0 && b.floor === 0) return 1;
      }

      // Prefer rooms with specific gender restrictions matching student
      if (a.allowedGender === student.gender && b.allowedGender !== student.gender) return -1;
      if (a.allowedGender !== student.gender && b.allowedGender === student.gender) return 1;

      // Prefer single rooms over double
      if (a.type === 'single' && b.type === 'double') return -1;
      if (a.type === 'double' && b.type === 'single') return 1;

      return 0;
    });

    return prioritizedRooms[0];
  } catch (error) {
    console.error('Auto-allocation error:', error);
    return null;
  }
};

// Apply for accommodation (student only)
router.post('/', authenticateToken, requireStudent, [
  body('residenceId').isMongoId().withMessage('Valid residence ID is required'),
  body('fundingType').isIn(['nsfas', 'self-funded']).withMessage('Valid funding type is required'),
  body('emergencyContact.name').optional().trim(),
  body('emergencyContact.phone').optional().trim(),
  body('emergencyContact.relationship').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { residenceId, fundingType, emergencyContact, medicalInfo, previousResidence } = req.body;

    // Check if student already has an application for this residence
    const existingApplication = await Application.findOne({
      student: req.user._id,
      residence: residenceId
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You have already applied for this residence' 
      });
    }

    // Check if student already has an allocated room
    if (req.user.allocatedRoom) {
      return res.status(400).json({
        message: 'You already have an allocated room'
      });
    }

    // Verify residence exists
    const residence = await Residence.findById(residenceId);
    if (!residence) {
      return res.status(404).json({ message: 'Residence not found' });
    }

    // Create application
    const application = new Application({
      student: req.user._id,
      residence: residenceId,
      fundingType,
      emergencyContact,
      medicalInfo,
      previousResidence
    });

    await application.save();

    // Try auto-allocation
    const allocatedRoom = await autoAllocateRoom(application);
    
    if (allocatedRoom) {
      // Allocate room
      allocatedRoom.occupants.push({
        student: req.user._id,
        allocatedDate: new Date()
      });
      await allocatedRoom.save();

      // Update application
      application.status = 'allocated';
      application.room = allocatedRoom._id;
      application.allocationDate = new Date();
      await application.save();

      // Update student
      await User.findByIdAndUpdate(req.user._id, {
        allocatedRoom: allocatedRoom._id,
        applicationStatus: 'allocated'
      });

      // Update residence stats
      await Residence.findByIdAndUpdate(residenceId, {
        $inc: { occupiedRooms: 1 }
      });
    } else {
      // Set as pending for manual review
      await User.findByIdAndUpdate(req.user._id, {
        applicationStatus: 'pending'
      });
    }

    await application.populate([
      { path: 'residence', select: 'name location' },
      { path: 'room', select: 'roomNumber floor type' }
    ]);

    res.status(201).json({
      message: allocatedRoom ? 'Application submitted and room allocated successfully!' : 'Application submitted successfully and is pending review',
      application
    });
  } catch (error) {
    console.error('Apply for accommodation error:', error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
});

// Get student's applications
router.get('/my', authenticateToken, requireStudent, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('residence', 'name location images priceRange')
      .populate('room', 'roomNumber floor type price')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Get student applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Get applications for landlord's residences
router.get('/residence/:residenceId', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const { residenceId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    // Verify landlord owns this residence
    const residence = await Residence.findById(residenceId);
    if (!residence || residence.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    let query = { residence: residenceId };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('student', 'name email studentNumber gender hasDisability')
      .populate('room', 'roomNumber floor type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get residence applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Update application status (landlord only)
router.put('/:id/status', authenticateToken, requireLandlord, [
  body('status').isIn(['pending', 'accepted', 'rejected', 'allocated']).withMessage('Valid status is required'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('residence');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify landlord owns the residence
    if (application.residence.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Update application
    application.status = status;
    application.responseDate = new Date();
    if (notes) application.notes = notes;

    // Update student status
    await User.findByIdAndUpdate(application.student, {
      applicationStatus: status
    });

    // Handle allocation
    if (status === 'allocated' && !application.room) {
      const allocatedRoom = await autoAllocateRoom(application);
      if (allocatedRoom) {
        allocatedRoom.occupants.push({
          student: application.student,
          allocatedDate: new Date()
        });
        await allocatedRoom.save();

        application.room = allocatedRoom._id;
        application.allocationDate = new Date();

        await User.findByIdAndUpdate(application.student, {
          allocatedRoom: allocatedRoom._id
        });
      }
    }

    await application.save();

    await application.populate([
      { path: 'student', select: 'name email studentNumber' },
      { path: 'room', select: 'roomNumber floor type' }
    ]);

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
});

// Request room change (student only)
router.post('/change-room', authenticateToken, requireStudent, [
  body('reason').trim().notEmpty().withMessage('Reason for room change is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user.allocatedRoom) {
      return res.status(400).json({ message: 'You do not have an allocated room' });
    }

    const { reason } = req.body;

    // Get current room details
    const currentRoom = await Room.findById(req.user.allocatedRoom)
      .populate('residence');

    if (!currentRoom) {
      return res.status(400).json({ message: 'Current room not found' });
    }

    // Create a new application for room change
    const changeApplication = new Application({
      student: req.user._id,
      residence: currentRoom.residence._id,
      fundingType: 'self-funded', // Default for room changes
      notes: `Room change request: ${reason}`,
      status: 'pending'
    });

    await changeApplication.save();

    res.status(201).json({
      message: 'Room change request submitted successfully',
      application: changeApplication
    });
  } catch (error) {
    console.error('Room change request error:', error);
    res.status(500).json({ message: 'Failed to submit room change request' });
  }
});

// Get application statistics (landlord only)
router.get('/stats/residence/:residenceId', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const { residenceId } = req.params;

    // Verify landlord owns this residence
    const residence = await Residence.findById(residenceId);
    if (!residence || residence.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these statistics' });
    }

    const [pending, accepted, rejected, allocated] = await Promise.all([
      Application.countDocuments({ residence: residenceId, status: 'pending' }),
      Application.countDocuments({ residence: residenceId, status: 'accepted' }),
      Application.countDocuments({ residence: residenceId, status: 'rejected' }),
      Application.countDocuments({ residence: residenceId, status: 'allocated' })
    ]);

    res.json({
      stats: {
        pending,
        accepted,
        rejected,
        allocated,
        total: pending + accepted + rejected + allocated
      }
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ message: 'Failed to fetch application statistics' });
  }
});

module.exports = router;