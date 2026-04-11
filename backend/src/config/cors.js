const env = require('./env');

const allowedOrigins = new Set(
  [env.app.frontendUrl].filter(Boolean)
);

// Any localhost or 127.0.0.1 origin is allowed in development regardless of port
function isLocalOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    // In production, block all no-origin requests (e.g. direct curl calls)
    if (!origin) {
      if (env.app.isProduction) {
        return callback(new Error('CORS: direct server-to-server requests are not allowed.'));
      }
      // Allow no-origin in development for local testing tools
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    // In development allow any localhost port (Vite :5173, CRA :3000, etc.)
    if (!env.app.isProduction && isLocalOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: origin "${origin}" is not allowed.`));
  }
};

module.exports = corsOptions;
