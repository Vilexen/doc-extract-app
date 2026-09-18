// Pagination utility functions

/**
 * Calculate pagination offset
 * @param {number} page - Current page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {number} Offset for database query
 */
const getOffset = (page, limit) => {
  return (parseInt(page) - 1) * parseInt(limit);
};

/**
 * Calculate total pages
 * @param {number} totalItems - Total number of items
 * @param {number} limit - Number of items per page
 * @returns {number} Total number of pages
 */
const getTotalPages = (totalItems, limit) => {
  return Math.ceil(parseInt(totalItems) / parseInt(limit));
};

/**
 * Create pagination object
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total items count
 * @returns {Object} Pagination metadata
 */
const getPagination = (page, limit, totalItems) => {
  const currentPage = parseInt(page);
  const pageLimit = parseInt(limit);
  const totalItemsCount = parseInt(totalItems);

  const totalPages = getTotalPages(totalItemsCount, pageLimit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    pageLimit,
    totalItems: totalItemsCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null
  };
};

/**
 * Paginate query results
 * @param {Array} results - Query results
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total items count
 * @returns {Object} Paginated results with metadata
 */
const paginateResults = (results, page, limit, totalItems) => {
  const pagination = getPagination(page, limit, totalItems);

  return {
    data: results,
    pagination
  };
};

/**
 * Get pagination parameters from query
 * @param {Object} query - Query parameters object
 * @returns {Object} Pagination parameters with defaults
 */
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  // Ensure reasonable limits
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100); // Between 1 and 100

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit
  };
};

module.exports = {
  getOffset,
  getTotalPages,
  getPagination,
  paginateResults,
  getPaginationParams
};