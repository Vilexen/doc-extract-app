// Helper functions for the application

/**
 * Format currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (INR, USD, EUR, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (isNaN(amount) || amount === null) return '₹0.00';

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };

  const symbol = currencySymbols[currency] || '₹';
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format date string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format pattern
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'display') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';

  const formats = {
    'yyyy-MM-dd': dateObj.toISOString().split('T')[0],
    'dd/MM/yyyy': dateObj.toLocaleDateString('en-GB'),
    'MM/dd/yyyy': dateObj.toLocaleDateString('en-US'),
    'dd MMM, yyyy': dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    'dd MMM, yyyy HH:mm': dateObj.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    'timestamp': dateObj.getTime()
  };

  return formats[format] || formats['display'];
};

/**
 * Calculate tax amount
 * @param {number} amount - Base amount
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} Tax amount
 */
export const calculateTax = (amount, taxRate) => {
  if (isNaN(amount) || isNaN(taxRate)) return 0;
  return (amount * taxRate) / 100;
};

/**
 * Calculate total amount with tax
 * @param {number} amount - Base amount
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} Total amount including tax
 */
export const calculateTotalWithTax = (amount, taxRate) => {
  if (isNaN(amount) || isNaN(taxRate)) return 0;
  return amount + (amount * taxRate) / 100;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @returns {boolean} True if file type is allowed
 */
export const isValidFileType = (file) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp'
  ];
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInBytes - Maximum allowed size in bytes
 * @returns {boolean} True if file size is within limit
 */
export const isValidFileSize = (file, maxSizeInBytes = 10 * 1024 * 1024) => {
  return file.size <= maxSizeInBytes;
};

/**
 * Generate unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};

  const getter = typeof key === 'function' ? key : (item) => item[key];
  return array.reduce((result, item) => {
    const group = getter(item);
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Sort array by multiple fields
 * @param {Array} array - Array to sort
 * @param {Array} sortFields - Array of {field: string, order: 'asc'|'desc'} objects
 * @returns {Array} Sorted array
 */
export const sortByFields = (array, sortFields) => {
  if (!Array.isArray(array) || !Array.isArray(sortFields)) return array;

  return [...array].sort((a, b) => {
    for (const { field, order } of sortFields) {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export default {
  formatCurrency,
  formatDate,
  calculateTax,
  calculateTotalWithTax,
  isValidFileType,
  isValidFileSize,
  generateId,
  debounce,
  deepClone,
  groupBy,
  sortByFields
};