const { durationMs, write } = require('./debug-log');

function asyncHandler(fn) {
  return function asyncRouteHandler(req, res, next) {
    const startedAt = process.hrtime.bigint();
    const handler = fn.name || 'anonymousController';

    if (req.log) {
      req.log('controller:start', { handler });
    } else {
      write('info', 'backend', 'controller:start', { handler });
    }

    Promise.resolve(fn(req, res, next))
      .then(() => {
        const details = {
          handler,
          statusCode: res.statusCode,
          headersSent: res.headersSent,
          durationMs: Number(durationMs(startedAt).toFixed(2))
        };

        if (req.log) {
          req.log('controller:resolved', details);
        } else {
          write('info', 'backend', 'controller:resolved', details);
        }
      })
      .catch((error) => {
        const details = {
          handler,
          error,
          durationMs: Number(durationMs(startedAt).toFixed(2))
        };

        if (req.log) {
          req.log('controller:error', details, 'error');
        } else {
          write('error', 'backend', 'controller:error', details);
        }

        next(error);
      });
  };
}

module.exports = asyncHandler;
