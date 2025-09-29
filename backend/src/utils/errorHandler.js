/**
 * Standardized error response utility
 * Ensures all backend errors follow the same format for frontend consumption
 */

/**
 * Creates a standardized error response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details (optional)
 * @returns {Object} Standardized error response
 */
export const createErrorResponse = (message, statusCode = 400, details = null) => {
  const errorResponse = {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };

  if (details) {
    errorResponse.details = details;
  }

  return errorResponse;
};

/**
 * Sends a standardized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details (optional)
 */
export const sendErrorResponse = (res, message, statusCode = 400, details = null) => {
  const errorResponse = createErrorResponse(message, statusCode, details);
  res.status(statusCode).json(errorResponse);
};

/**
 * Handles async controller errors in a standardized way
 * @param {Function} fn - Async controller function
 * @returns {Function} Wrapped controller function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      Logger.error('❌ Unhandled async error', error);
      sendErrorResponse(res, error.message || 'An unexpected error occurred', 500);
    });
  };
};

/**
 * Common error messages for consistency
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'A user with this email already exists. Please try logging in instead.',
  INVALID_TOKEN: 'Invalid or expired token',
  ACCESS_DENIED: 'Access denied',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation error',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  INVALID_EMAIL: 'Invalid email format',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists',
  OPERATION_NOT_ALLOWED: 'Operation not allowed',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  DATABASE_ERROR: 'Database operation failed',
  
  // File upload errors
  FILE_TOO_LARGE: 'File size exceeds maximum allowed limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_UPLOAD_FAILED: 'File upload failed',
  
  // Rate limiting
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later.'
};

/**
 * HTTP status codes for common scenarios
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};
