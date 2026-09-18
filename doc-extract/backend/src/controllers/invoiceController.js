// @desc    Start processing invoice
// @route   POST /api/invoices/:id/process
// @access  Private
exports.startProcessing = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Find invoice
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check if user owns this invoice
    if (invoice.user_id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to process this invoice'
      });
    }

    // Check if invoice can be processed
    if (!['draft', 'queued', 'failed'].includes(invoice.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot process invoice with status: ${invoice.status}`
      });
    }

    // Update invoice status to queued
    invoice.status = 'queued';
    await invoice.save();

    // Create or update processing job
    let processingJob = await ProcessingJob.findOne({ invoice_id: invoiceId });
    if (!processingJob) {
      processingJob = await ProcessingJob.create({
        user_id: req.user.userId,
        invoice_id: invoiceId,
        status: 'queued'
      });
    } else {
      // Reset job to queued
      processingJob.status = 'queued';
      processingJob.error_message = null;
      processingJob.completed_at = null;
      await processingJob.save();
    }

    res.status(200).json({
      success: true,
      message: 'Invoice queued for processing',
      data: {
        processingJobId: processingJob._id
      }
    });
  } catch (error) {
    console.error('Start processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue invoice for processing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};