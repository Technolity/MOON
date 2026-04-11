const ApiError = require('../errors/api-error');

function notFound(req, res, next) {
  next(
    new ApiError(404, `Route ${req.method} ${req.originalUrl} was not found.`)
  );
}

module.exports = notFound;
