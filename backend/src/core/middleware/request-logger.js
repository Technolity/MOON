const { durationMs, requestDetails, write } = require('../utils/debug-log');

function makeRequestId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();
  req.id = req.headers['x-request-id'] || makeRequestId();

  req.log = (event, details = {}, level = 'info') => {
    write(level, 'backend', event, {
      requestId: req.id,
      method: req.method,
      originalUrl: req.originalUrl,
      ...details
    });
  };

  write('info', 'backend', 'request:start', requestDetails(req));

  res.on('finish', () => {
    write('info', 'backend', 'request:finish', {
      ...requestDetails(req),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      contentLength: res.getHeader('content-length'),
      durationMs: Number(durationMs(startedAt).toFixed(2))
    });
  });

  res.on('close', () => {
    if (!res.writableEnded) {
      write('warn', 'backend', 'request:closed-before-finish', {
        ...requestDetails(req),
        statusCode: res.statusCode,
        durationMs: Number(durationMs(startedAt).toFixed(2))
      });
    }
  });

  next();
}

module.exports = requestLogger;
