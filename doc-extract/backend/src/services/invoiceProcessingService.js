const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const ProcessingJob = require('../models/ProcessingJob');
const ReviewEvent = require('../models/ReviewEvent');
const config = require('../config/config');

// Mock OCR function - in production, replace with Tesseract or other OCR engine
const mockOCR = async (filePath) => {
  // Simulate OCR processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock OCR text based on file name or random
  // In a real app, we would call Tesseract: const { createWorker } = require('tesseract.js');
  // const worker = await createWorker();
  // const { data: { text } } = await worker.recognize(filePath);
  // await worker.terminate();
  // return text;

  // For now, return a sample invoice text
  return `
    INVOICE
    Invoice Number: INV-2026-001
    Date: 2026-09-01
    Due Date: 2026-09-30

    Vendor: ABC Office Supplies Ltd.
    GSTIN: 07AABCU1234R1Z5

    Description          Qty    Unit Price    Amount
    Office Chair         2      5000.00       10000.00
    Desk Lamp            5      800.00        4000.00
    Notebook Set         10     200.00        2000.00

    Subtotal:                                       16000.00
    Tax (18%):                                      2880.00
    Total:                                          18880.00

    Terms: Net 30
  `;
};

// Mock AI extraction function - in production, replace with actual AI model (e.g., using TensorFlow, or API call to LLM)
const mockAIExtraction = async (ocrText) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Parse the OCR text to extract structured data
  // This is a simplified parser - in reality, we would use NLP or ML models

  const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  const extractedData = {
    vendor_name: '',
    vendor_tax_id: '',
    invoice_number: '',
    invoice_date: '',
    due_date: '',
    total_amount: 0,
    subtotal: 0,
    tax_amount: 0,
    tax_rate: 0,
    line_items: [],
    notes: '',
    confidence_score: 0.92 // Mock confidence
  };

  // Simple regex patterns to extract data
  const invoiceNumberMatch = ocrText.match(/Invoice Number:\s*([^\n]+)/i);
  if (invoiceNumberMatch) {
    extractedData.invoice_number = invoiceNumberMatch[1].trim();
  }

  const invoiceDateMatch = ocrText.match(/Date:\s*([^\n]+)/i);
  if (invoiceDateMatch) {
    extractedData.invoice_date = invoiceDateMatch[1].trim();
  }

  const dueDateMatch = ocrText.match(/Due Date:\s*([^\n]+)/i);
  if (dueDateMatch) {
    extractedData.due_date = dueDateMatch[1].trim();
  }

  const vendorNameMatch = ocrText.match(/Vendor:\s*([^\n]+)/i);
  if (vendorNameMatch) {
    extractedData.vendor_name = vendorNameMatch[1].trim();
  }

  const vendorTaxIdMatch = ocrText.match(/GSTIN:\s*([^\n]+)/i);
  if (vendorTaxIdMatch) {
    extractedData.vendor_tax_id = vendorTaxIdMatch[1].trim();
  }

  const totalAmountMatch = ocrText.match(/Total:\s*([^\n]+)/i);
  if (totalAmountMatch) {
    const amountStr = totalAmountMatch[1].trim().replace(/[^\d.]/g, '');
    extractedData.total_amount = parseFloat(amountStr) || 0;
  }

  const subtotalMatch = ocrText.match(/Subtotal:\s*([^\n]+)/i);
  if (subtotalMatch) {
    const amountStr = subtotalMatch[1].trim().replace(/[^\d.]/g, '');
    extractedData.subtotal = parseFloat(amountStr) || 0;
  }

  const taxAmountMatch = ocrText.match(/Tax\s*\([^%]+%\):\s*([^\n]+)/i);
  if (taxAmountMatch) {
    const amountStr = taxAmountMatch[1].trim().replace(/[^\d.]/g, '');
    extractedData.tax_amount = parseFloat(amountStr) || 0;
  }

  // Extract line items (simplified)
  const lineItemRegex = /^([A-Za-z\s]+)\s+(\d+)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)$/gm;
  let match;
  const lineItems = [];
  while ((match = lineItemRegex.exec(ocrText)) !== null) {
    const description = match[1].trim();
    const quantity = parseInt(match[2]);
    const unitPrice = parseFloat(match[3].replace(/,/g, ''));
    const amount = parseFloat(match[4].replace(/,/g, ''));

    lineItems.push({
      description,
      quantity,
      unit_price: unitPrice,
      total_amount: amount,
      tax_rate: 18, // Assume 18% tax
      hsnsac_code: ''
    });
  }

  extractedData.line_items = lineItems;

  // If we didn't find line items via regex, try another approach
  if (lineItems.length === 0) {
    // Look for a table-like structure
    const linesAfterHeader = ocrText.split('\n');
    let inItemSection = false;
    for (const line of linesAfterHeader) {
      if (line.includes('Description') && line.includes('Qty') && line.includes('Unit Price') && line.includes('Amount')) {
        inItemSection = true;
        continue;
      }
      if (inItemSection && line.includes('Subtotal')) {
        break;
      }
      if (inItemSection && line.trim().length > 0) {
        const parts = line.split(/\s+/).filter(part => part.length > 0);
        if (parts.length >= 4) {
          const description = parts.slice(0, -3).join(' ');
          const quantity = parseInt(parts[-3]);
          const unitPrice = parseFloat(parts[-2].replace(/[^\d.]/g, ''));
          const amount = parseFloat(parts[-1].replace(/[^\d.]/g, ''));
          if (!isNaN(quantity) && !isNaN(unitPrice) && !isNaN(amount)) {
            lineItems.push({
              description,
              quantity,
              unit_price: unitPrice,
              total_amount: amount,
              tax_rate: 18,
              hsnsac_code: ''
            });
          }
        }
      }
    }
    extractedData.line_items = lineItems;
  }

  return extractedData;
};

// Validation service
const validateInvoice = (extractedData) => {
  const validationResults = {
    mathematical: { passed: false, message: '' },
    dates: { passed: false, message: '' },
    vendor: { passed: false, message: '' },
    line_items: { passed: false, message: '' },
    overall: false
  };

  // 1. Mathematical validation: line items sum should equal subtotal
  const lineItemsSum = extractedData.line_items.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price);
  }, 0);

  const subtotal = extractedData.subtotal || 0;
  const taxAmount = extractedData.tax_amount || 0;
  const totalAmount = extractedData.total_amount || 0;

  // Allow small rounding differences
  const mathematicalPassed = Math.abs(lineItemsSum - subtotal) < 0.01 &&
                            Math.abs(subtotal + taxAmount - totalAmount) < 0.01;

  validationResults.mathematical.passed = mathematicalPassed;
  validationResults.mathematical.message = mathematicalPassed
    ? 'Mathematical validation passed: Line items sum matches subtotal and subtotal + tax equals total.'
    : `Mathematical validation failed: Line items sum (${lineItemsSum.toFixed(2)}) does not match subtotal (${subtotal.toFixed(2)}), or subtotal + tax (${(subtotal + taxAmount).toFixed(2)}) does not match total (${totalAmount.toFixed(2)}).`;

  // 2. Date validation: invoice date should be before due date
  if (extractedData.invoice_date && extractedData.due_date) {
    const invoiceDate = new Date(extractedData.invoice_date);
    const dueDate = new Date(extractedData.due_date);
    const datesPassed = invoiceDate <= dueDate;
    validationResults.dates.passed = datesPassed;
    validationResults.dates.message = datesPassed
      ? 'Date validation passed: Invoice date is on or before due date.'
      : 'Date validation failed: Invoice date is after due date.';
  } else {
    validationResults.dates.passed = false;
    validationResults.dates.message = 'Date validation skipped: Missing invoice or due date.';
  }

  // 3. Vendor validation: vendor tax ID should be present and valid format (simplified)
  if (extractedData.vendor_tax_id) {
    // Basic GSTIN format: 2 digits, 5 uppercase letters, 4 digits, 1 uppercase letter, 1 digit, 1 uppercase letter
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}$/;
    const vendorPassed = gstinRegex.test(extractedData.vendor_tax_id);
    validationResults.vendor.passed = vendorPassed;
    validationResults.vendor.message = vendorPassed
      ? 'Vendor validation passed: GSTIN format is valid.'
      : 'Vendor validation failed: GSTIN format is invalid.';
  } else {
    validationResults.vendor.passed = false;
    validationResults.vendor.message = 'Vendor validation failed: Vendor tax ID is missing.';
  }

  // 4. Line items validation: at least one line item
  const lineItemsPassed = extractedData.line_items.length > 0;
  validationResults.line_items.passed = lineItemsPassed;
  validationResults.line_items.message = lineItemsPassed
    ? `Line items validation passed: Found ${extractedData.line_items.length} line item(s).`
    : 'Line items validation failed: No line items found.';

  // Overall validation
  validationResults.overall = validationResults.mathematical.passed &&
                             validationResults.dates.passed &&
                             validationResults.vendor.passed &&
                             validationResults.line_items.passed;

  return validationResults;
};

// Duplicate detection service (simplified)
const checkForDuplicate = async (invoiceData, userId) => {
  // In a real implementation, we would use fuzzy matching on invoice number, vendor, amount, etc.
  // For now, we'll check for exact invoice number match for the same user

  const existingInvoice = await Invoice.findOne({
    user_id: userId,
    invoice_number: invoiceData.invoice_number,
    status: { $nin: ['deleted'] } // Exclude deleted invoices
  });

  return !!existingInvoice; // true if duplicate found
};

// Main processing function
const processInvoice = async (invoiceId, userId) => {
  let processingJob = null;
  let invoice = null;
  let startTime = Date.now();

  try {
    // Find the invoice and processing job
    invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    processingJob = await ProcessingJob.findOne({ invoice_id: invoiceId });
    if (!processingJob) {
      throw new Error('Processing job not found');
    }

    // Update job status to processing
    processingJob.status = 'processing';
    processingJob.started_at = new Date();
    await processingJob.save();

    // Step 1: OCR
    const filePath = invoice.s3_key; // In production, this would be an S3 key or local path
    let ocrText = '';
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('Invoice file not found on disk');
      }
      ocrText = await mockOCR(filePath);
    } catch (ocrError) {
      throw new Error(`OCR processing failed: ${ocrError.message}`);
    }

    // Save OCR text to invoice
    invoice.ocr_text = ocrText;

    // Step 2: AI Extraction
    let extractedData = {};
    try {
      extractedData = await mockAIExtraction(ocrText);
    } catch (aiError) {
      throw new Error(`AI extraction failed: ${aiError.message}`);
    }

    // Step 3: Validation
    const validationResults = validateInvoice(extractedData);

    // Step 4: Duplicate check
    let isDuplicate = false;
    try {
      isDuplicate = await checkForDuplicate(extractedData, userId);
    } catch (dupError) {
      console.warn('Duplicate check failed:', dupError);
      // Continue processing even if duplicate check fails
    }

    // Step 5: Prepare data for saving
    // Determine status based on validation and duplicate check
    let newStatus = 'extracted'; // Default status after extraction
    if (validationResults.overall && !isDuplicate) {
      newStatus = 'validated'; // Auto-validated if all checks pass and not duplicate
    } else if (isDuplicate) {
      newStatus = 'duplicate';
    } else {
      newStatus = 'extracted'; // Needs review
    }

    // Update invoice with extracted data
    invoice.vendor_name = extractedData.vendor_name || '';
    invoice.vendor_tax_id = extractedData.vendor_tax_id || '';
    invoice.invoice_number = extractedData.invoice_number || '';
    invoice.invoice_date = extractedData.invoice_date ? new Date(extractedData.invoice_date) : null;
    invoice.due_date = extractedData.due_date ? new Date(extractedData.due_date) : null;
    invoice.total_amount = extractedData.total_amount || 0;
    invoice.status = newStatus;
    invoice.confidence_score = extractedData.confidence_score || 0;
    invoice.extracted_data = extractedData;

    // Save invoice
    await invoice.save();

    // Step 6: Save line items
    // First, delete any existing line items for this invoice
    await InvoiceItem.deleteMany({ invoice_id: invoiceId });

    // Then create new line items
    const lineItemPromises = extractedData.line_items.map(item => {
      return InvoiceItem.create({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_amount: item.total_amount,
        tax_rate: item.tax_rate,
        hsnsac_code: item.hsnsac_code
      });
    });

    await Promise.all(lineItemPromises);

    // Step 7: Create review event for auto-processing
    await ReviewEvent.create({
      invoice_id: invoiceId,
      user_id: userId,
      action: 'processed',
      field_name: 'processing',
      old_value: 'queued',
      new_value: newStatus,
      ip_address: '127.0.0.1', // In real app, would get from request
      user_agent: 'Invoice Processing Service'
    });

    // Step 8: Update processing job as completed
    const endTime = Date.now();
    const processingTimeMs = endTime - startTime;

    processingJob.status = newStatus === 'failed' ? 'failed' : 'completed';
    processingJob.completed_at = new Date();
    processingJob.processing_time_ms = processingTimeMs;
    // Mock OCR and AI engine used
    processingJob.ocr_engine_used = 'tesseract'; // Mock
    processingJob.ai_model_used = 'layoutlmv3'; // Mock
    if (newStatus === 'failed') {
      processingJob.error_message = 'Validation failed';
    }
    await processingJob.save();

    return {
      success: true,
      invoiceId: invoice._id,
      status: newStatus,
      validationResults,
      isDuplicate
    };

  } catch (error) {
    console.error('Invoice processing error:', error);

    // Update processing job as failed
    if (processingJob) {
      const endTime = Date.now();
      const processingTimeMs = endTime - startTime;

      processingJob.status = 'failed';
      processingJob.error_message = error.message;
      processingJob.completed_at = new Date();
      processingJob.processing_time_ms = processingTimeMs;
      // Mock OCR and AI engine used (still set even if failed)
      processingJob.ocr_engine_used = 'tesseract';
      processingJob.ai_model_used = 'layoutlmv3';
      await processingJob.save();
    }

    // Update invoice status to failed if we have it
    if (invoice) {
      invoice.status = 'failed';
      await invoice.save();
    }

    throw error;
  }
};

module.exports = {
  processInvoice,
  mockOCR,
  mockAIExtraction,
  validateInvoice,
  checkForDuplicate
};