const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const corsOptions = require('./config/cors');
const env = require('./config/env');
const errorHandler = require('./core/middleware/error-handler');
const notFound = require('./core/middleware/not-found');
const apiLimiter = require('./core/middleware/rate-limit');
const sendResponse = require('./core/utils/send-response');
const apiRouter = require('./modules');

const app = express();

// Trust the first proxy hop (required for accurate client IPs behind Render/Railway/Nginx)
app.set('trust proxy', 1);

// Remove the X-Powered-By header
app.disable('x-powered-by');

// Security headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    }
  })
);

app.use(cors(corsOptions));
app.use(cookieParser());

// Body parsers — enforce size limits on both formats
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Request logging — minimal format in production to avoid logging sensitive data
if (!env.app.isProduction) {
  app.use(morgan('dev'));
} else {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// Root probe — minimal info only
app.get('/', (req, res) => {
  return sendResponse(res, {
    message: `${env.app.name} is running.`
  });
});

app.use(env.app.apiPrefix, apiLimiter, apiRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
