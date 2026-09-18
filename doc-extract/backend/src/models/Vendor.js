const mongoose = require('mongoose');

// Vendor Schema based on workflow analysis
const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  contact_person: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  tax_id: {
    type: String,
    trim: true,
    uppercase: true
  },
  isActive: {
    type: Boolean,
    default: true
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
vendorSchema.index({ name: 1 });
vendorSchema.index({ tax_id: 1 });
vendorSchema.index({ email: 1 });
vendorSchema.index({ isActive: 1 });
vendorSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Vendor', vendorSchema);