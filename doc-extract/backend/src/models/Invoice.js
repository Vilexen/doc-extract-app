const mongoose = require('mongoose');

// Invoice Schema based on workflow analysis
const invoiceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'Vendor ID is required']
  },
  invoice_number: {
    type: String,
    required: [true, 'Invoice number is required'],
    trim: true
  },
  invoice_date: {
    type: Date,
    required: [true
  },
  due_date: {
    type: Date,
  },
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount must be positive']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP', 'JPY']
  },
  status: {
    type: String,
    enum: ['draft', 'processing', 'extracted', 'validated', 'reviewed', 'approved', 'rejected', 'exported'],
    default: 'draft'
  },
  // OCR/AI Processing fields
  ocr_text: {
    type: String
  },
  confidence_score: {
    type: Number,
    min: 0,
    max: 100
  },
  // File information
  original_filename: {
    type: String
  },
  file_size: {
    type: Number
  },
  file_type: {
    type: String
  },
  s3_key: {
    type: String
  },
  // Extracted data (will be populated by AI/OCR)
  extracted_data: {
    type: mongoose.Schema.Types.Mixed
  },
  // Flags for review
  flags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes
invoiceSchema.index({ user_id: 1 });
invoiceSchema.index({ vendor_id: 1 });
invoiceSchema.index({ invoice_number: 1 });
invoiceSchema.index({ invoice_date: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ user_id: 1, status: 1 });
invoiceSchema.index({ vendor_id: 1, invoice_number: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);