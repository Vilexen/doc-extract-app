const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

// Protect all vendor routes
router.use(protect);

// Get vendors with filtering and pagination
router.get('/', getVendors);

// Get single vendor
router.get('/:id', getVendorById);

// Create vendor
router.post('/', createVendor);

// Update vendor
router.put('/:id', updateVendor);

// Delete vendor
router.delete('/:id', deleteVendor);

module.exports = router;