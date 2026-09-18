const mongoose = require('mongoose');

// Audit Trail Schema for comprehensive logging
const auditTrailSchema = new mongoose.Schema({
  // User who performed the action
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  // Action performed
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'create', 'read', 'update', 'delete',
      'login', 'logout', 'token_refresh',
      'upload_invoice', 'start_processing',
      'complete_processing', 'review_invoice',
      'approve_invoice', 'reject_invoice',
      'export_data', 'change_password',
      'update_profile', 'create_vendor',
      'update_vendor', 'delete_vendor'
    ]
  },

  // Resource type affected
  resource_type: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: [
      'user', 'invoice', 'vendor', 'invoice_item',
      'processing_job', 'review_event', 'export',
      'auth_session', 'system'
    ]
  },

  // Resource ID (if applicable)
  resource_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resource_type'
  },

  // Description of the action
  description: {
    type: String,
    required: [true, 'Description is required']
  },

  // Changes made (for update/delete operations)
  changes: {
    type: mongoose.Schema.Types.Mixed
  },

  // IP address of the user
  ip_address: {
    type: String
  },

  // User agent string
  user_agent: {
    type: String
  },

  // Outcome of the action
  outcome: {
    type: String,
    enum: ['success', 'failure', 'partial'],
    default: 'success'
  },

  // Error message if action failed
  error_message: {
    type: String
  },

  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },

  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Create indexes for efficient querying
auditTrailSchema.index({ user_id: 1, timestamp: -1 });
auditTrailSchema.index({ resource_type: 1, resource_id: 1 });
auditTrailSchema.index({ action: 1, timestamp: -1 });
auditTrailSchema.index({ outcome: 1, timestamp: -1 });
auditTrailSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditTrail', auditTrailSchema);