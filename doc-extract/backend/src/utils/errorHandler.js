// Custom error class for application-specific errors
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper for Express routes
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  // In a real app, we would use the logger utility here
  console.error(`ERROR: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Validation error handler for Joi or similar validation libraries
const handleValidationError = (err) => {
  const errors = Object.values(err.details).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Cast error handler for Mongoose
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Duplicate field error handler for Mongoose
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Validation error handler for Mongoose
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = {
  AppError,
  catchAsync,
  globalErrorHandler,
  handleValidationError,
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB
};