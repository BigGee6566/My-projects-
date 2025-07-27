const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { uploadMessageAttachments, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Send message
router.post('/', 
  authenticateToken,
  uploadMessageAttachments,
  handleUploadError,
  [
    body('recipientId').isMongoId().withMessage('Valid recipient ID is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('content').trim().notEmpty().withMessage('Message content is required'),
    body('messageType').optional().isIn(['general', 'application', 'maintenance', 'payment', 'emergency']),
    body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
    body('relatedApplication').optional().isMongoId(),
    body('relatedResidence').optional().isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { recipientId, subject, content, messageType, priority, relatedApplication, relatedResidence } = req.body;

      // Verify recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
      }

      // Prepare message data
      const messageData = {
        sender: req.user._id,
        recipient: recipientId,
        subject,
        content,
        messageType: messageType || 'general',
        priority: priority || 'normal'
      };

      if (relatedApplication) messageData.relatedApplication = relatedApplication;
      if (relatedResidence) messageData.relatedResidence = relatedResidence;

      // Handle attachments
      if (req.files && req.files.length > 0) {
        messageData.attachments = req.files.map(file => ({
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype
        }));
      }

      const message = new Message(messageData);
      await message.save();

      await message.populate([
        { path: 'sender', select: 'name email role' },
        { path: 'recipient', select: 'name email role' },
        { path: 'relatedApplication', select: 'status' },
        { path: 'relatedResidence', select: 'name location' }
      ]);

      res.status(201).json({
        message: 'Message sent successfully',
        messageData: message
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  }
);

// Get user's messages (inbox)
router.get('/inbox', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead, messageType, priority } = req.query;

    let query = { recipient: req.user._id };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    if (messageType) {
      query.messageType = messageType;
    }

    if (priority) {
      query.priority = priority;
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email role')
      .populate('relatedApplication', 'status')
      .populate('relatedResidence', 'name location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount
    });
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Get sent messages
router.get('/sent', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, messageType } = req.query;

    let query = { sender: req.user._id };

    if (messageType) {
      query.messageType = messageType;
    }

    const messages = await Message.find(query)
      .populate('recipient', 'name email role')
      .populate('relatedApplication', 'status')
      .populate('relatedResidence', 'name location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get sent messages error:', error);
    res.status(500).json({ message: 'Failed to fetch sent messages' });
  }
});

// Get message by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .populate('relatedApplication', 'status')
      .populate('relatedResidence', 'name location');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender or recipient
    if (message.sender._id.toString() !== req.user._id.toString() && 
        message.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this message' });
    }

    // Mark as read if user is the recipient
    if (message.recipient._id.toString() === req.user._id.toString() && !message.isRead) {
      message.isRead = true;
      message.readDate = new Date();
      await message.save();
    }

    res.json({ message });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ message: 'Failed to fetch message' });
  }
});

// Mark message as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }

    message.isRead = true;
    message.readDate = new Date();
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Failed to mark message as read' });
  }
});

// Mark multiple messages as read
router.put('/bulk/read', authenticateToken, [
  body('messageIds').isArray().withMessage('Message IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { messageIds } = req.body;

    const result = await Message.updateMany(
      {
        _id: { $in: messageIds },
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readDate: new Date()
      }
    );

    res.json({
      message: `Marked ${result.modifiedCount} messages as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
});

// Delete message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only recipient can delete messages from their inbox
    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

// Get conversation between two users
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    });

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
});

// Get message statistics
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const [unread, total, sent, received] = await Promise.all([
      Message.countDocuments({ recipient: req.user._id, isRead: false }),
      Message.countDocuments({ recipient: req.user._id }),
      Message.countDocuments({ sender: req.user._id }),
      Message.countDocuments({ recipient: req.user._id })
    ]);

    // Message type breakdown
    const typeBreakdown = await Message.aggregate([
      { $match: { recipient: req.user._id } },
      { $group: { _id: '$messageType', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        unread,
        total,
        sent,
        received,
        typeBreakdown
      }
    });
  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({ message: 'Failed to fetch message statistics' });
  }
});

module.exports = router;