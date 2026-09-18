const mongoose = require('mongoose');

// Processing Job Schema based on workflow analysis
const processingJobSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required']
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'ocr_completed', 'ai_extraction_completed', 'validated', 'review_required', 'completed', 'failed'],
    default: 'queued'
  },
  started_at: {
    type: Date
  },
  completed_at: {
    type: Date
  },
  error_message: {
    type: String
  },
  // Processing metrics
  ocr_engine_used: {
    type: String,
    enum: ['textract', 'vision', 'tesseract', 'form_recognizer']
  },
  ai_model_used: {
    type: String,
    enum: ['layoutlmv3', 'donut', 'bert_ner', 'claude']
  },
  processing_time_ms: {
    type: Number
  },
  confidence_scores: {
    type: mongoose.Schema.Types.Mixed
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
processingJobSchema.index({ user_id: 1 });
processingJobSchema.index({ invoice_id: 1 });
processingJobSchema.index({ status: 1 });
processingJobSchema.index({ createdAt: -1 });
processingJobSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model('ProcessingJob', processingJobSchema);