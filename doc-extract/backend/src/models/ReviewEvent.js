const mongoose = require('mongoose');

// Review Event Schema based on workflow analysis
const reviewEventSchema = new mongoose.Schema({
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  action: {
    type: String,
    enum: [
      'viewed',
      'edited',
      'flagged',
      'comment_added',
      'approved',
      'rejected',
      'validation_passed',
      'validation_failed'
    ],
    required: [true, 'Action is required']
  },
  field_name: {
    type: String
  },
  old_value: {
    type: mongoose.Schema.Types.Mixed
  },
  new_value: {
    type: mongoose.Schema.Types.Mixed
  },
  comments: {
    type: String
  },
  confidence_before: {
    type: Number
  },
  confidence_after: {
    type: Number
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes
reviewEventSchema.index({ invoice_id: 1 });
reviewEventSchema.index({ user_id: 1 });
reviewEventSchema.index({ action: 1 });
reviewEventSchema.index({ createdAt: -1 });
reviewEventSchema.index({ invoice_id: 1, action: 1 });
reviewEventSchema.index({ user_id: 1, action: 1 });

module.exports = mongoose.model('ReviewEvent', reviewEventSchema);