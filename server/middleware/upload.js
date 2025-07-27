const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/residences', 'uploads/rooms', 'uploads/documents', 'uploads/messages'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'proofOfResidence') {
      uploadPath += 'documents/';
    } else if (file.fieldname === 'residenceImages' || file.fieldname === 'floorPlan') {
      uploadPath += 'residences/';
    } else if (file.fieldname === 'roomImages') {
      uploadPath += 'rooms/';
    } else if (file.fieldname === 'messageAttachments') {
      uploadPath += 'messages/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'proofOfResidence') {
    // Allow PDF and images for documents
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed for proof documents'), false);
    }
  } else if (file.fieldname.includes('Images') || file.fieldname === 'floorPlan') {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } else {
    cb(null, true);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per request
  }
});

// Specific upload configurations
const uploadSingle = upload.single('file');
const uploadMultiple = upload.array('files', 10);
const uploadResidenceFields = upload.fields([
  { name: 'residenceImages', maxCount: 10 },
  { name: 'floorPlan', maxCount: 1 }
]);
const uploadRoomImages = upload.array('roomImages', 5);
const uploadProofDocument = upload.single('proofOfResidence');
const uploadMessageAttachments = upload.array('messageAttachments', 3);

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded' });
    }
  }
  
  if (error.message) {
    return res.status(400).json({ message: error.message });
  }
  
  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadResidenceFields,
  uploadRoomImages,
  uploadProofDocument,
  uploadMessageAttachments,
  handleUploadError
};