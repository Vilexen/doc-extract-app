const ProcessingJob = require('../models/ProcessingJob');
const { processInvoice } = require('../services/invoiceProcessingService');
const config = require('../config/config');

// Worker configuration
const WORKER_INTERVAL = parseInt(config.processingWorkerInterval) || 5000; // 5 seconds
const BATCH_SIZE = parseInt(config.processingWorkerBatchSize) || 5; // Process up to 5 jobs at a time
let isWorkerRunning = false;

/**
 * Process queued jobs
 */
const processQueuedJobs = async () => {
  // Prevent multiple workers from running simultaneously
  if (isWorkerRunning) {
    return;
  }

  isWorkerRunning = true;

  try {
    // Find queued jobs
    const queuedJobs = await ProcessingJob.find({ status: 'queued' })
      .sort({ createdAt: 1 }) // Oldest first
      .limit(BATCH_SIZE);

    if (queuedJobs.length === 0) {
      isWorkerRunning = false;
      return;
    }

    console.log(`[Worker] Found ${queuedJobs.length} queued job(s) to process`);

    // Process each job
    for (const job of queuedJobs) {
      try {
        // Mark job as processing to prevent other workers from picking it up
        job.status = 'processing';
        job.started_at = new Date();
        await job.save();

        console.log(`[Worker] Processing job ${job._id} for invoice ${job.invoice_id}`);

        // Process the invoice
        const result = await processInvoice(job.invoice_id.toString(), job.user_id.toString());

        console.log(`[Worker] Job ${job._id} processed successfully with status: ${result.status}`);
      } catch (error) {
        console.error(`[Worker] Error processing job ${job._id}:`, error);

        // Update job as failed
        try {
          job.status = 'failed';
          job.error_message = error.message;
          job.completed_at = new Date();
          await job.save();
        } catch (saveError) {
          console.error(`[Worker] Error saving failed job ${job._id}:`, saveError);
        }
      }
    }
  } catch (error) {
    console.error('[Worker] Error in worker loop:', error);
  } finally {
    isWorkerRunning = false;
  }
};

/**
 * Start the worker
 */
const startWorker = () => {
  console.log('[Worker] Starting invoice processing worker...');

  // Run immediately on start
  processQueuedJobs().then(() => {
    // Set up interval
    setInterval(processQueuedJobs, WORKER_INTERVAL);
  });
};

module.exports = {
  startWorker,
  processQueuedJobs // For testing
};