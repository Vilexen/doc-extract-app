require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice_extraction',

  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // File upload configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff'
  ],

  // OCR configuration
  ocrEnginePrimary: process.env.OCR_ENGINE_PRIMARY || 'textract',
  ocrEngineSecondary: process.env.OCR_ENGINE_SECONDARY || 'vision',
  ocrConfidenceThreshold: parseFloat(process.env.OCR_CONFIDENCE_THRESHOLD) || 0.85,

  // Redis configuration
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT) || 6379,

  // AWS configuration
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  s3BucketName: process.env.S3_BUCKET_NAME || 'invoice-extraction-platform',

  // Email configuration
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: parseInt(process.env.EMAIL_PORT) || 587,
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',

  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // Session configuration
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'invoice_extraction_session',
  sessionCookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
  sessionCookieHttpOnly: process.env.SESSION_COOKIE_HTTPONLY !== 'false',

  // Feature flags
  enableOcr: process.env.ENABLE_OCR === 'true' || true,
  enableAiExtraction: process.env.ENABLE_AI_EXTRACTION === 'true' || true,
  enableValidation: process.env.ENABLE_VALIDATION === 'true' || true,
  enableDuplicateDetection: process.env.ENABLE_DUPLICATE_DETECTION === 'true' || true,
  enableExport: process.env.ENABLE_EXPORT === 'true' || true,
  enableAnalytics: process.env.ENABLE_ANALYTICS === 'true' || true,

  // Pagination defaults
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
  maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,

  // Upload settings
  uploadsDirectory: process.env.UPLOADS_DIRECTORY || './uploads',

  // Token settings
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-change-in-production',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // Worker settings
  processingWorkerInterval: process.env.PROCESSING_WORKER_INTERVAL || 5000, // 5 seconds
  processingWorkerBatchSize: process.env.PROCESSING_WORKER_BATCH_SIZE || 5
};

module.exports = config;