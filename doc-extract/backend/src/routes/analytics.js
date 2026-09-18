const express = require('express');
const router = express.Router();
const {
  getSummary,
  getTrends,
  getVendorAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Protect all analytics routes
router.use(protect);

// Get analytics summary
router.get('/summary', getSummary);

// Get analytics trends
router.get('/trends', getTrends);

// Get vendor analytics
router.get('/vendors', getVendorAnalytics);

module.exports = router;