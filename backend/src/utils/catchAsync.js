/**
 * Wraps an async route handler to catch errors and pass them to Express's error handling middleware
 * @param {Function} fn - The async route handler function
 * @returns {Function} - A new function that handles errors
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 