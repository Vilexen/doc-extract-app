const mongoose = require('mongoose');

// Export Schema based on workflow analysis
const exportSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  export_format: {
    type: String,
    required: [true, 'Export format is required'],
    enum: ['csv', 'json', 'excel', 'pdf', 'xml', 'ubl']
  },
  file_path: {
    type: String,
    required: [true, 'File path is required']
  },
  record_count: {
    type: Number,
    required: [true, 'Record count is required'],
    min: [0, 'Record count must be positive']
  },
  invoice_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Invoice'
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  error_message: {
    type: String
  },
  downloaded_at: {
    type: Date
  },
  download_count: {
    type: Number,
    default: 0
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
exportSchema.index({ user_id: 1 });
exportSchema.index({ export_format: 1 });
exportSchema.index({ status: 1 });
exportSchema.index({ createdAt: -1 });
exportSchema.index({ user_id: 1, export_format: 1 });

module.exports = mongoose.model('Export', exportSchema);