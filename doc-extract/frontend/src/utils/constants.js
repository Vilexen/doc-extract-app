// Application constants
export const APP_NAME = 'InvoiceExtractor';
export const APP_VERSION = '1.0.0';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  AUDITOR: 'auditor',
  USER: 'user'
};

// Invoice statuses
export const INVOICE_STATUSES = {
  DRAFT: 'draft',
  PROCESSING: 'processing',
  EXTRACTED: 'extracted',
  VALIDATED: 'validated',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPORTED: 'exported'
};

// File types
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/bmp'
];

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Currency codes
export const CURRENCIES = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

// Tax types for India
export const TAX_TYPES = {
  CGST: 'Central Goods and Services Tax',
  SGST: 'State Goods and Services Tax',
  IGST: 'Integrated Goods and Services Tax',
  UTGST: 'Union Territory Goods and Services Tax'
};

// Common HSN code ranges (simplified)
export const HSN_CODE_RANGES = {
  LIVE_ANIMALS: '01000000-05000000',
  VEGETABLE_PRODUCTS: '06000000-15000000',
  ANIMAL_PRODUCTS: '16000000-24000000',
  PREPARED_FOODSTUFFS: '20000000-24000000',
  MINERAL_PRODUCTS: '25000000-27000000',
  CHEMICAL_PRODUCTS: '28000000-38000000',
  PLASTICS_RUBBER: '39000000-40000000',
  LEATHER_PRODUCTS: '41000000-43000000',
  WOOD_PRODUCTS: '44000000-49000000',
  TEXTILES: '50000000-63000000',
  FOOTWEAR: '64000000-67000000',
  HEADGEAR: '65000000-67000000',
  ARTIFICIAL_FLOWERS: '67000000-67000000',
  STONE_PLASTER: '68000000-70000000',
  CERAMIC_PRODUCTS: '69000000-70000000',
  GLASS_GLASSWARE: '70000000-71000000',
  PEARLS_STONES: '71000000-71000000',
  METALS: '72000000-83000000',
  MACHINERY_ELECTRICAL: '84000000-85000000',
  VEHICLES: '86000000-89000000',
  OPTICAL_MEDICAL: '90000000-92000000',
  ARMS_AMMUNITION: '93000000-93000000',
  MISCELLANEOUS: '94000000-96000000',
  WORKS_OF_ART: '97000000-97000000'
};

// Default pagination limits
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Date formats
export const DATE_FORMATS = {
  DATE_ONLY: 'yyyy-MM-dd',
  DATE_TIME: 'yyyy-MM-dd HH:mm:ss',
  DATE_TIME_MS: 'yyyy-MM-dd HH:mm:ss.SSS',
  DISPLAY_DATE: 'dd MMM, yyyy',
  DISPLAY_DATE_TIME: 'dd MMM, yyyy HH:mm'
};

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Export formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  EXCEL: 'excel',
  PDF: 'pdf',
  XML: 'xml',
  UBL: 'ubl'
};

// Time periods for analytics
export const ANALYTICS_PERIODS = {
  SEVEN_DAYS: '7D',
  THIRTY_DAYS: '30D',
  NINETY_DAYS: '90D',
  YEAR_TO_DATE: 'YTD',
  CUSTOM: 'CUSTOM'
};

export default {
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  USER_ROLES,
  INVOICE_STATUSES,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  CURRENCIES,
  TAX_TYPES,
  HSN_CODE_RANGES,
  PAGINATION,
  DATE_FORMATS,
  NOTIFICATION_TYPES,
  EXPORT_FORMATS,
  ANALYTICS_PERIODS
};