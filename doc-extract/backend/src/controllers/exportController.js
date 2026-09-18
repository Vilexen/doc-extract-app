const Export = require('../models/Export');
const Invoice = require('../models/Invoice');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const csv = require('json2csv').parse;
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const config = require('../config/config');

// Helper function to fetch invoices for export
const fetchInvoicesForExport = async (userId, filters, limit = 0) => {
  const query = { user_id: userId };

  // Apply filters
  if (filters.status) query.status = filters.status;
  if (filters.vendor_id) query.vendor_id = filters.vendor_id;
  if (filters.startDate || filters.endDate) {
    query.invoice_date = {};
    if (filters.startDate) query.invoice_date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.invoice_date.$lte = new Date(filters.endDate);
  }
  if (filters.search) {
    query.$or = [
      { invoice_number: { $regex: filters.search, $options: 'i' } },
      { 'extracted_data.vendor_name': { $regex: filters.search, $options: 'i' } }
    ];
  }

  // Sort by creation date descending
  const sort = { createdAt: -1 };

  // Limit if specified
  const queryObj = Invoice.find(query).sort(sort);
  if (limit > 0) {
    queryObj.limit(limit);
  }

  // Populate vendor and line items
  const invoices = await queryObj
    .populate('vendor_id', 'name tax_id')
    .populate({
      path: 'invoiceItems',
      match: { invoice_id: { $exists: true } },
      options: { sort: { createdAt: 1 } }
    })
    .lean();

  return invoices;
};

// Helper function to generate CSV
const generateCSV = (invoices) => {
  // Flatten invoice data for CSV
  const csvData = invoices.map(invoice => {
    const lineItems = invoice.invoiceItems || [];
    const itemsString = lineItems.map(item =>
      `${item.description} (${item.quantity} x ₹${item.unit_price})`
    ).join('; ');

    return {
      'Invoice Number': invoice.invoice_number || '',
      'Invoice Date': invoice.invoice_date ? invoice.invoice_date.toISOString().split('T')[0] : '',
      'Due Date': invoice.due_date ? invoice.due_date.toISOString().split('T')[0] : '',
      'Vendor Name': invoice.vendor_name || '',
      'Vendor GSTIN': invoice.vendor_tax_id || '',
      'Total Amount (₹)': invoice.total_amount || 0,
      'Status': invoice.status,
      'Line Items': itemsString,
      'Notes': invoice.notes || ''
    };
  });

  return csv(csvData);
};

// Helper function to generate Excel
const generateExcel = async (invoices) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Invoice Extraction Platform';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Invoices');

  // Define columns
  worksheet.columns = [
    { header: 'Invoice Number', key: 'invoice_number', width: 20 },
    { header: 'Invoice Date', key: 'invoice_date', width: 15 },
    { header: 'Due Date', key: 'due_date', width: 15 },
    { header: 'Vendor Name', key: 'vendor_name', width: 30 },
    { header: 'Vendor GSTIN', key: 'vendor_tax_in', width: 20 },
    { header: 'Total Amount (₹)', key: 'total_amount', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Line Items', key: 'line_items', width: 50 },
    { header: 'Notes', key: 'notes', width: 30 }
  ];

  // Add rows
  invoices.forEach(invoice => {
    const lineItems = invoice.invoiceItems || [];
    const itemsString = lineItems.map(item =>
      `${item.description} (${item.quantity} x ₹${item.unit_price})`
    ).join('; ');

    worksheet.addRow({
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date ? invoice.invoice_date.toISOString().split('T')[0] : '',
      due_date: invoice.due_date ? invoice.due_date.toISOString().split('T')[0] : '',
      vendor_name: invoice.vendor_name,
      vendor_tax_in: invoice.vendor_tax_id,
      total_amount: invoice.total_amount,
      status: invoice.status,
      line_items: itemsString,
      notes: invoice.notes
    });
  });

  return workbook;
};

// Helper function to generate PDF
const generatePDF = (invoices) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];

  doc.on('data', chunk => {
    chunks.push(chunk);
  });

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on('error', reject);

    // Title
    doc.fontSize(20).text('Invoice Export Report', { align: 'center' });
    doc.moveDown();

    // Date
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown();

    // Table header
    const tableTop = 150;

    doc.fontSize(10);
    doc.text('Invoice Number', 50, tableTop, { width: 100 });
    doc.text('Date', 150, tableTop, { width: 80 });
    doc.text('Vendor', 230, tableTop, { width: 150 });
    doc.text('Amount (₹)', 380, tableTop, { width: 80 });
    doc.text('Status', 460, tableTop, { width: 100 });

    doc.moveDown();

    // Table rows
    let yPosition = tableTop + 20;
    invoices.forEach((invoice, index) => {
      // Page break if needed
      if (yPosition > 750) {
        doc.addPage();
        yPosition = 50;
      }

      doc.text(invoice.invoice_number || '', 50, yPosition);
      doc.text(
        invoice.invoice_date ? invoice.invoice_date.toISOString().split('T')[0] : '',
        150, yPosition
      );
      doc.text(invoice.vendor_name || '', 230, yPosition);
      doc.text(
        (invoice.total_amount || 0).toFixed(2),
        380, yPosition,
        { align: 'right' }
      );
      doc.text(invoice.status || '', 460, yPosition);

      yPosition += 15;
    });

    doc.end();
  });
};

// @desc    Initiate export
// @route   POST /api/export
// @access  Private
exports.initiateExport = async (req, res) => {
  try {
    const { userId } = req.user;
    const { format, filters, limit } = req.body;

    // Validate format
    const allowedFormats = ['csv', 'json', 'excel', 'pdf'];
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        message: `Invalid export format. Allowed formats: ${allowedFormats.join(', ')}`
      });
    }

    // Fetch invoices
    const invoices = await fetchInvoicesForExport(userId, filters, limit);

    if (invoices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No invoices found matching the criteria'
      });
    }

    // Create export record
    const exportRecord = await Export.create({
      user_id: userId,
      export_format: format,
      record_count: invoices.length,
      invoice_ids: invoices.map(inv => inv._id),
      parameters: { filters, limit },
      status: 'processing'
    });

    // Generate file based on format
    let filePath = '';
    let fileName = '';

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      fileName = `invoice_export_${timestamp}.${format}`;
      const uploadDir = path.join(__dirname, '../../exports');

      // Ensure exports directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      filePath = path.join(uploadDir, fileName);

      switch (format) {
        case 'csv':
          const csvData = generateCSV(invoices);
          fs.writeFileSync(filePath, csvData);
          break;

        case 'json':
          const jsonData = JSON.stringify(
            invoices.map(invoice => ({
              ...invoice,
              invoice_date: invoice.invoice_date ? invoice.invoice_date.toISOString() : null,
              due_date: invoice.due_date ? invoice.due_date.toISOString() : null,
              createdAt: invoice.createdAt ? invoice.createdAt.toISOString() : null,
              updatedAt: invoice.updatedAt ? invoice.updatedAt.toISOString() : null
            })),
            null, 2
          );
          fs.writeFileSync(filePath, jsonData);
          break;

        case 'excel':
          const workbook = await generateExcel(invoices);
          await workbook.writeFile(filePath);
          break;

        case 'pdf':
          const pdfBuffer = await generatePDF(invoices);
          fs.writeFileSync(filePath, pdfBuffer);
          break;
      }

      // Update export record with file path and status
      exportRecord.file_path = filePath;
      exportRecord.status = 'completed';
      await exportRecord.save();

      res.status(201).json({
        success: true,
        message: 'Export initiated successfully',
        data: {
          exportId: exportRecord._id,
          format,
          recordCount: invoices.length,
          downloadUrl: `/api/export/${exportRecord._id}/download`
        }
      });
    } catch (generationError) {
      console.error('Export generation error:', generationError);

      // Update export record as failed
      exportRecord.status = 'failed';
      exportRecord.error_message = generationError.message;
      await exportRecord.save();

      res.status(500).json({
        success: false,
        message: 'Failed to generate export file',
        error: process.env.NODE_ENV === 'development' ? generationError.message : 'Internal server error'
      });
    }
  } catch (error) {
    console.error('Initiate export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate export',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get export status
// @route   GET /api/export/:exportId
// @access  Private
exports.getExportStatus = async (req, res) => {
  try {
    const { exportId } = req.params;
    const { userId } = req.user;

    const exportRecord = await Export.findOne({
      _id: exportId,
      user_id: userId
    });

    if (!exportRecord) {
      return res.status(404).json({
        success: false,
        message: 'Export not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: exportRecord._id,
        format: exportRecord.export_format,
        status: exportRecord.status,
        recordCount: exportRecord.record_count,
        filePath: exportRecord.file_path,
        errorMessage: exportRecord.error_message,
        createdAt: exportRecord.createdAt,
        updatedAt: exportRecord.updatedAt,
        downloadUrl: exportRecord.status === 'completed'
          ? `/api/export/${exportRecord._id}/download`
          : null
      }
    });
  } catch (error) {
    console.error('Get export status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch export status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Download exported file
// @route   GET /api/export/:exportId/download
// @access  Private
exports.downloadExport = async (req, res) => {
  try {
    const { exportId } = req.params;
    const { userId } = req.user;

    const exportRecord = await Export.findOne({
      _id: exportId,
      user_id: userId
    });

    if (!exportRecord) {
      return res.status(404).json({
        success: false,
        message: 'Export not found'
      });
    }

    if (exportRecord.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Export is not ready for download. Current status: ${exportRecord.status}`
      });
    }

    if (!exportRecord.file_path || !fs.existsSync(exportRecord.file_path)) {
      return res.status(404).json({
        success: false,
        message: 'Export file not found'
      });
    }

    // Update download count
    exportRecord.download_count += 1;
    exportRecord.downloaded_at = new Date();
    await exportRecord.save();

    // Determine content type
    let contentType = 'application/octet-stream';
    switch (exportRecord.export_format) {
      case 'csv':
        contentType = 'text/csv';
        break;
      case 'json':
        contentType = 'application/json';
        break;
      case 'excel':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
    }

    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${path.basename(exportRecord.file_path)}"`
    );

    // Send file
    res.sendFile(exportRecord.file_path);
  } catch (error) {
    console.error('Download export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download export',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete export
// @route   DELETE /api/export/:exportId
// @access  Private
exports.deleteExport = async (req, res) => {
  try {
    const { exportId } = req.params;
    const { userId } = req.user;

    const exportRecord = await Export.findOneAndDelete({
      _id: exportId,
      user_id: userId
    });

    if (!exportRecord) {
      return res.status(404).json({
        success: false,
        message: 'Export not found'
      });
    }

    // Delete file if exists
    if (exportRecord.file_path && fs.existsSync(exportRecord.file_path)) {
      fs.unlinkSync(exportRecord.file_path);
    }

    res.status(200).json({
      success: true,
      message: 'Export deleted successfully'
    });
  } catch (error) {
    console.error('Delete export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete export',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  initiateExport: exports.initiateExport,
  getExportStatus: exports.getExportStatus,
  downloadExport: exports.downloadExport,
  deleteExport: exports.deleteExport
};