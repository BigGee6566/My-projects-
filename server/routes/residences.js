const express = require('express');
const { body, validationResult } = require('express-validator');
const Residence = require('../models/Residence');
const Room = require('../models/Room');
const { authenticateToken, requireLandlord, requireVerified } = require('../middleware/auth');
const { uploadResidenceFields, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Get all residences (public)
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
    
    let query = { isActive: true };
    
    // Add search filters
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query['priceRange.min'] = {};
      if (minPrice) query['priceRange.min'].$gte = Number(minPrice);
      if (maxPrice) query['priceRange.max'] = { $lte: Number(maxPrice) };
    }

    const residences = await Residence.find(query)
      .populate('landlord', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Residence.countDocuments(query);

    res.json({
      residences,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get residences error:', error);
    res.status(500).json({ message: 'Failed to fetch residences' });
  }
});

// Get residence by ID
router.get('/:id', async (req, res) => {
  try {
    const residence = await Residence.findById(req.params.id)
      .populate('landlord', 'name email contactInfo');

    if (!residence) {
      return res.status(404).json({ message: 'Residence not found' });
    }

    // Get rooms for this residence
    const rooms = await Room.find({ residence: residence._id, isActive: true });

    res.json({ 
      residence,
      rooms
    });
  } catch (error) {
    console.error('Get residence error:', error);
    res.status(500).json({ message: 'Failed to fetch residence' });
  }
});

// Create residence (landlord only)
router.post('/', 
  authenticateToken, 
  requireLandlord, 
  requireVerified,
  uploadResidenceFields,
  handleUploadError,
  [
    body('name').trim().notEmpty().withMessage('Residence name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').optional().trim(),
    body('priceRange.min').isNumeric().withMessage('Minimum price must be a number'),
    body('priceRange.max').isNumeric().withMessage('Maximum price must be a number'),
    body('amenities').optional().isArray(),
    body('rules').optional().isArray()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const residenceData = {
        ...req.body,
        landlord: req.user._id
      };

      // Handle uploaded files
      if (req.files) {
        if (req.files.residenceImages) {
          residenceData.images = req.files.residenceImages.map(file => file.path);
        }
        if (req.files.floorPlan && req.files.floorPlan[0]) {
          residenceData.floorPlan = req.files.floorPlan[0].path;
        }
      }

      const residence = new Residence(residenceData);
      await residence.save();

      await residence.populate('landlord', 'name email');

      res.status(201).json({
        message: 'Residence created successfully',
        residence
      });
    } catch (error) {
      console.error('Create residence error:', error);
      res.status(500).json({ message: 'Failed to create residence' });
    }
  }
);

// Update residence (landlord only)
router.put('/:id',
  authenticateToken,
  requireLandlord,
  uploadResidenceFields,
  handleUploadError,
  async (req, res) => {
    try {
      const residence = await Residence.findById(req.params.id);

      if (!residence) {
        return res.status(404).json({ message: 'Residence not found' });
      }

      if (residence.landlord.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this residence' });
      }

      const updateData = { ...req.body };

      // Handle uploaded files
      if (req.files) {
        if (req.files.residenceImages) {
          updateData.images = req.files.residenceImages.map(file => file.path);
        }
        if (req.files.floorPlan && req.files.floorPlan[0]) {
          updateData.floorPlan = req.files.floorPlan[0].path;
        }
      }

      const updatedResidence = await Residence.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('landlord', 'name email');

      res.json({
        message: 'Residence updated successfully',
        residence: updatedResidence
      });
    } catch (error) {
      console.error('Update residence error:', error);
      res.status(500).json({ message: 'Failed to update residence' });
    }
  }
);

// Delete residence (landlord only)
router.delete('/:id', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const residence = await Residence.findById(req.params.id);

    if (!residence) {
      return res.status(404).json({ message: 'Residence not found' });
    }

    if (residence.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this residence' });
    }

    // Check if there are occupied rooms
    const occupiedRooms = await Room.countDocuments({
      residence: residence._id,
      isOccupied: true
    });

    if (occupiedRooms > 0) {
      return res.status(400).json({
        message: 'Cannot delete residence with occupied rooms'
      });
    }

    await Residence.findByIdAndDelete(req.params.id);

    res.json({ message: 'Residence deleted successfully' });
  } catch (error) {
    console.error('Delete residence error:', error);
    res.status(500).json({ message: 'Failed to delete residence' });
  }
});

// Get landlord's residences
router.get('/my/residences', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const residences = await Residence.find({ landlord: req.user._id })
      .sort({ createdAt: -1 });

    // Get room counts for each residence
    const residencesWithStats = await Promise.all(
      residences.map(async (residence) => {
        const totalRooms = await Room.countDocuments({ 
          residence: residence._id, 
          isActive: true 
        });
        const occupiedRooms = await Room.countDocuments({ 
          residence: residence._id, 
          isOccupied: true 
        });

        return {
          ...residence.toJSON(),
          totalRooms,
          occupiedRooms,
          availableRooms: totalRooms - occupiedRooms
        };
      })
    );

    res.json({ residences: residencesWithStats });
  } catch (error) {
    console.error('Get my residences error:', error);
    res.status(500).json({ message: 'Failed to fetch your residences' });
  }
});

// Get featured residences (for homepage)
router.get('/featured/list', async (req, res) => {
  try {
    const featuredResidences = await Residence.find({
      isActive: true,
      availableRooms: { $gt: 0 }
    })
      .populate('landlord', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ residences: featuredResidences });
  } catch (error) {
    console.error('Get featured residences error:', error);
    res.status(500).json({ message: 'Failed to fetch featured residences' });
  }
});

module.exports = router;