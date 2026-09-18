const mongoose = require('mongoose');

// Invoice Item Schema based on workflow analysis
const invoiceItemSchema = new mongoose.Schema({
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required']
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be positive']
  },
  unit_price: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price must be positive']
  },
  total_price: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price must be positive']
  },
  tax_rate: {
    type: Number,
    min: [0, 'Tax rate cannot be negative'],
    max: [100, 'Tax rate cannot exceed 100%']
  },
  tax_amount: {
    type: Number,
    min: [0, 'Tax amount cannot be negative']
  },
  hsn_code: {
    type: String,
    trim: true
  },
  sac_code: {
    type: String,
    trim: true
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
invoiceItemSchema.index({ invoice_id: 1 });
invoiceSchema.index({ hsn_code: 1 });
invoiceSchema.index({ sac_code: 1 });

// Virtual for calculating total with tax
invoiceItemSchema.virtual('total_with_tax').get(function() {
  return this.total_price + (this.tax_amount || 0);
});

module.exports = mongoose.model('InvoiceItem', invoiceItemSchema);