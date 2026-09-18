const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  startProcessing
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

// Protect all invoice routes
router.use(protect);

// Get invoices with filtering and pagination
router.get('/', getInvoices);

// Get single invoice
router.get('/:id', getInvoiceById);

// Update invoice
router.put('/:id', updateInvoice);

// Delete invoice
router.delete('/:id', deleteInvoice);

// Start processing invoice
router.post('/:id/process', startProcessing);

module.exports = router;