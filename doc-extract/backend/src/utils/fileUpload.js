const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

// File upload configuration
const uploadConfig = {
  // Storage directory
  storagePath: process.env.UPLOADS_DIRECTORY || './uploads',

  // Allowed file types
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp'
  ],

  // Maximum file size (10MB)
  maxSize: 10 * 1024 * 1024,

  // Allowed file extensions
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.tiff', '.bmp']
};

// Ensure upload directory exists
const ensureUploadDirectory = () => {
  if (!fs.existsSync(uploadConfig.storagePath)) {
    fs.mkdirSync(uploadConfig.storagePath, { recursive: true });
  }
};

// Generate unique filename
const generateFilename = (originalName) => {
  const timestamp = Date.now();
  const randomStr = uuidv4().substring(0, 8);
  const extension = path.extname(originalName);
  const filenameWithoutExt = path.basename(originalName, extension);

  // Sanitize filename (remove special characters)
  const sanitizedName = filenameWithoutExt
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 50); // Limit length

  return `${sanitizedName}_${timestamp}_${randomStr}${extension}`;
};

// Validate file
const validateFile = (file) => {
  const errors = [];

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return errors;
  }

  // Check file size
  if (file.size > uploadConfig.maxSize) {
    errors.push(`File size exceeds ${uploadConfig.maxSize / (1024 * 1024)}MB limit`);
  }

  // Check file type
  if (!uploadConfig.allowedTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} is not allowed`);
  }

  // Check file extension
  const extension = path.extname(file.originalname).toLowerCase();
  if (!uploadConfig.allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} is not allowed`);
  }

  return errors;
};

// Save file to disk
const saveFile = async (file) => {
  // Validate file first
  const validationErrors = validateFile(file);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(', '));
  }

  // Ensure upload directory exists
  ensureUploadDirectory();

  // Generate unique filename
  const filename = generateFilename(file.originalname);
  const filePath = path.join(uploadConfig.storagePath, filename);

  // Save file
  await fs.promises.writeFile(filePath, file.buffer);

  return {
    filename,
    originalName: file.originalname,
    filePath,
    size: file.size,
    mimeType: file.mimetype,
    extension: path.extname(file.originalname)
  };
};

// Delete file from disk
const deleteFile = (filename) => {
  const filePath = path.join(uploadConfig.storagePath, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
};

// Get file URL (for serving static files)
const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

// Get file path
const getFilePath = (filename) => {
  return path.join(uploadConfig.storagePath, filename);
};

module.exports = {
  uploadConfig,
  ensureUploadDirectory,
  generateFilename,
  validateFile,
  saveFile,
  deleteFile,
  getFileUrl,
  getFilePath
};