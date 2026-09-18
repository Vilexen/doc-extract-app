const express = require('express');
const router = express.Router();
const { uploadInvoice, getUploadStatus, cancelUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Protect all upload routes
router.use(protect);

// File upload route
router.post('/', uploadInvoice);

// Get upload status
router.get('/:uploadId', getUploadStatus);

// Cancel upload
router.delete('/:uploadId', cancelUpload);

module.exports = router;