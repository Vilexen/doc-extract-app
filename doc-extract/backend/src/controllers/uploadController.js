const path = require('path');
const fs = require('fs');
const Invoice = require('../models/Invoice');
const ProcessingJob = require('../models/ProcessingJob');

// Configure multer for file uploads
const multer = require('multer');

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, PNG, TIFF, BMP are allowed'), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  }
});

// @desc    Upload invoice file
// @route   POST /api/upload
// @access  Private
exports.uploadInvoice = [
  upload.single('invoice'),
  async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { userId } = req.body;

      // Validate userId
      if (!userId) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Create invoice record with queued status
      const invoice = await Invoice.create({
        user_id: userId,
        original_filename: req.file.originalname,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        s3_key: req.file.path, // In production, this would be S3 key
        status: 'queued' // Will be updated to processing by worker
      });

      // Create processing job
      const processingJob = await ProcessingJob.create({
        user_id: userId,
        invoice_id: invoice._id,
        status: 'queued'
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          invoiceId: invoice._id,
          processingJobId: processingJob._id,
          file: {
            originalName: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype
          }
        }
      });
    } catch (error) {
      console.error('Upload error:', error);

      // Clean up uploaded file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'File upload failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
];

// @desc    Get upload status
// @route   GET /api/upload/:uploadId
// @access  Private
exports.getUploadStatus = async (req, res) => {
  try {
    const { uploadId } = req.params;

    // Find processing job
    const processingJob = await ProcessingJob.findById(uploadId)
      .populate('invoice_id')
      .populate('user_id', 'email full_name');

    if (!processingJob) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    // Check if user owns this upload
    if (processingJob.user_id._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this upload'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: processingJob._id,
        status: processingJob.status,
        invoice: processingJob.invoice_id ? {
          id: processingJob.invoice_id._id,
          original_filename: processingJob.invoice_id.original_filename,
          file_size: processingJob.invoice_id.file_size,
          file_type: processingJob.invoice_id.file_type,
          status: processingJob.invoice_id.status
        } : null,
        user: {
          id: processingJob.user_id._id,
          email: processingJob.user_id.email,
          full_name: processingJob.user_id.full_name
        },
        started_at: processingJob.started_at,
        completed_at: processingJob.completed_at,
        error_message: processingJob.error_message,
        createdAt: processingJob.createdAt,
        updatedAt: processingJob.updatedAt
      }
    });
  } catch (error) {
    console.error('Get upload status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upload status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Cancel upload
// @route   DELETE /api/upload/:uploadId
// @access  Private
exports.cancelUpload = async (req, res) => {
  try {
    const { uploadId } = req.params;

    // Find processing job
    const processingJob = await ProcessingJob.findById(uploadId);

    if (!processingJob) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    // Check if user owns this upload
    if (processingJob.user_id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this upload'
      });
    }

    // Only allow cancellation of queued or processing jobs
    if (!['queued', 'processing'].includes(processingJob.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel upload with status: ${processingJob.status}`
      });
    }

    // Update status to cancelled (we'll use failed for simplicity)
    processingJob.status = 'failed';
    processingJob.error_message = 'Upload cancelled by user';
    processingJob.completed_at = new Date();
    await processingJob.save();

    // Clean up file if exists
    if (processingJob.invoice_id) {
      const invoice = await Invoice.findById(processingJob.invoice_id);
      if (invoice && invoice.s3_key && fs.existsSync(invoice.s3_key)) {
        fs.unlinkSync(invoice.s3_key);
      }
      // Delete invoice record
      await Invoice.findByIdAndDelete(processingJob.invoice_id);
    }

    res.status(200).json({
      success: true,
      message: 'Upload cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel upload',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  uploadInvoice: exports.uploadInvoice,
  getUploadStatus: exports.getUploadStatus,
  cancelUpload: exports.cancelExport
};