const env = require('../../config/env');
const ApiError = require('../errors/api-error');
const { requestDetails, write } = require('../utils/debug-log');

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isApiError = err instanceof ApiError;

  const statusCode = isApiError ? err.statusCode : 500;
  const message = isApiError ? err.message : 'Internal server error.';

  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  const details = {
    ...requestDetails(req),
    statusCode,
    isApiError,
    error: err
  };

  if (req.log) {
    req.log('error:handled', details, logLevel);
  } else {
    write(logLevel, 'backend', 'error:handled', details);
  }

  const body = { success: false, message };

  // Expose validation details (400s) always — they are safe and helpful for clients
  if (isApiError && statusCode < 500 && err.details) {
    body.details = err.details;
  }

  // Expose internal detail only in development to prevent information leakage
  if (!isApiError && env.app.isDevelopment) {
    body.detail = err.message;
  }

  return res.status(statusCode).json(body);
}

module.exports = errorHandler;
