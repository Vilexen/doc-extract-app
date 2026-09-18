const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Initiate export
router.post('/', exportController.initiateExport);

// Get export status
router.get('/:exportId', exportController.getExportStatus);

// Download exported file
router.get('/:exportId/download', exportController.downloadExport);

// Delete export
router.delete('/:exportId', exportController.deleteExport);

module.exports = router;