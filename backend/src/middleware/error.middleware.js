import { Logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  Logger.error('🚨 Unhandled error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?._id,
    errorName: err.name,
    errorCode: err.code
  });

  if (err.name === 'ValidationError') {
    Logger.warning('⚠️ Validation error', {
      errors: Object.values(err.errors).map(error => error.message),
      url: req.originalUrl,
      method: req.method
    });
    
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    Logger.warning('⚠️ Duplicate key error', {
      field: Object.keys(err.keyPattern)[0],
      url: req.originalUrl,
      method: req.method
    });
    
    return res.status(400).json({
      message: 'Duplicate Key Error',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  Logger.error('💥 Internal server error', {
    error: err.message,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?._id
  });

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};