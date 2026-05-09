const ApiError = require('../errors/api-error');

function notFound(req, res, next) {
  if (req.log) {
    req.log('route:not-found', {}, 'warn');
  }

  next(
    new ApiError(404, `Route ${req.method} ${req.originalUrl} was not found.`)
  );
}

module.exports = notFound;
