const express = require('express');
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const Residence = require('../models/Residence');
const { authenticateToken, requireLandlord } = require('../middleware/auth');
const { uploadRoomImages, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Create room (landlord only)
router.post('/', 
  authenticateToken, 
  requireLandlord,
  uploadRoomImages,
  handleUploadError,
  [
    body('residenceId').isMongoId().withMessage('Valid residence ID is required'),
    body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
    body('floor').isInt({ min: 0 }).withMessage('Floor must be a non-negative integer'),
    body('type').isIn(['single', 'double']).withMessage('Room type must be single or double'),
    body('numberOfBeds').isInt({ min: 1, max: 2 }).withMessage('Number of beds must be 1 or 2'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('allowedGender').optional().isIn(['male', 'female', 'any']).withMessage('Invalid gender restriction'),
    body('isAccessible').optional().isBoolean().withMessage('Accessibility must be true or false'),
    body('floorRestrictions.femaleOnly').optional().isBoolean(),
    body('floorRestrictions.disabilityAccess').optional().isBoolean(),
    body('floorRestrictions.groundFloorOnly').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { residenceId } = req.body;

      // Verify landlord owns the residence
      const residence = await Residence.findById(residenceId);
      if (!residence || residence.landlord.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to add rooms to this residence' });
      }

      // Check if room number already exists in this residence
      const existingRoom = await Room.findOne({
        residence: residenceId,
        roomNumber: req.body.roomNumber
      });

      if (existingRoom) {
        return res.status(400).json({ message: 'Room number already exists in this residence' });
      }

      const roomData = {
        ...req.body,
        residence: residenceId
      };

      // Handle uploaded images
      if (req.files && req.files.length > 0) {
        roomData.images = req.files.map(file => file.path);
      }

      const room = new Room(roomData);
      await room.save();

      // Update residence total rooms count
      await Residence.findByIdAndUpdate(residenceId, {
        $inc: { totalRooms: 1 }
      });

      await room.populate('residence', 'name location');

      res.status(201).json({
        message: 'Room created successfully',
        room
      });
    } catch (error) {
      console.error('Create room error:', error);
      res.status(500).json({ message: 'Failed to create room' });
    }
  }
);

// Get rooms for a residence
router.get('/residence/:residenceId', async (req, res) => {
  try {
    const { residenceId } = req.params;
    const { available, type, floor } = req.query;

    let query = { residence: residenceId, isActive: true };

    if (available === 'true') {
      query.isFull = false;
    }

    if (type) {
      query.type = type;
    }

    if (floor !== undefined) {
      query.floor = parseInt(floor);
    }

    const rooms = await Room.find(query)
      .populate('occupants.student', 'name studentNumber')
      .sort({ floor: 1, roomNumber: 1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('residence', 'name location landlord')
      .populate('occupants.student', 'name email studentNumber gender');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Failed to fetch room' });
  }
});

// Update room (landlord only)
router.put('/:id',
  authenticateToken,
  requireLandlord,
  uploadRoomImages,
  handleUploadError,
  async (req, res) => {
    try {
      const room = await Room.findById(req.params.id).populate('residence');

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (room.residence.landlord.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this room' });
      }

      const updateData = { ...req.body };

      // Handle uploaded images
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map(file => file.path);
      }

      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('residence', 'name location');

      res.json({
        message: 'Room updated successfully',
        room: updatedRoom
      });
    } catch (error) {
      console.error('Update room error:', error);
      res.status(500).json({ message: 'Failed to update room' });
    }
  }
);

// Delete room (landlord only)
router.delete('/:id', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('residence');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.residence.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    if (room.isOccupied) {
      return res.status(400).json({ message: 'Cannot delete occupied room' });
    }

    await Room.findByIdAndDelete(req.params.id);

    // Update residence total rooms count
    await Residence.findByIdAndUpdate(room.residence._id, {
      $inc: { totalRooms: -1 }
    });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Failed to delete room' });
  }
});

// Get landlord's rooms across all residences
router.get('/my/all', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const residences = await Residence.find({ landlord: req.user._id }).select('_id');
    const residenceIds = residences.map(r => r._id);

    const rooms = await Room.find({ residence: { $in: residenceIds } })
      .populate('residence', 'name location')
      .populate('occupants.student', 'name studentNumber email')
      .sort({ 'residence.name': 1, floor: 1, roomNumber: 1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Get my rooms error:', error);
    res.status(500).json({ message: 'Failed to fetch your rooms' });
  }
});

// Set floor restrictions (landlord only)
router.put('/:id/restrictions', 
  authenticateToken, 
  requireLandlord,
  [
    body('floorRestrictions.femaleOnly').optional().isBoolean(),
    body('floorRestrictions.disabilityAccess').optional().isBoolean(),
    body('floorRestrictions.groundFloorOnly').optional().isBoolean(),
    body('allowedGender').optional().isIn(['male', 'female', 'any'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const room = await Room.findById(req.params.id).populate('residence');

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (room.residence.landlord.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this room' });
      }

      const { floorRestrictions, allowedGender } = req.body;

      const updateData = {};
      if (floorRestrictions) updateData.floorRestrictions = floorRestrictions;
      if (allowedGender) updateData.allowedGender = allowedGender;

      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('residence', 'name location');

      res.json({
        message: 'Room restrictions updated successfully',
        room: updatedRoom
      });
    } catch (error) {
      console.error('Update room restrictions error:', error);
      res.status(500).json({ message: 'Failed to update room restrictions' });
    }
  }
);

// Bulk update floor restrictions for multiple rooms
router.put('/bulk/floor-restrictions',
  authenticateToken,
  requireLandlord,
  [
    body('residenceId').isMongoId().withMessage('Valid residence ID is required'),
    body('floor').isInt({ min: 0 }).withMessage('Floor must be a non-negative integer'),
    body('restrictions').isObject().withMessage('Restrictions must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { residenceId, floor, restrictions } = req.body;

      // Verify landlord owns the residence
      const residence = await Residence.findById(residenceId);
      if (!residence || residence.landlord.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update rooms in this residence' });
      }

      const result = await Room.updateMany(
        { residence: residenceId, floor: floor },
        { floorRestrictions: restrictions }
      );

      res.json({
        message: `Updated ${result.modifiedCount} rooms on floor ${floor}`,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error('Bulk update floor restrictions error:', error);
      res.status(500).json({ message: 'Failed to update floor restrictions' });
    }
  }
);

module.exports = router;