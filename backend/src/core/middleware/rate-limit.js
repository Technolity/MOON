const rateLimit = require('express-rate-limit');

// General API limiter — applied to all /api/* routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Strict limiter for auth endpoints — prevents brute-force on login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' }
});

// Payments limiter — allow reasonable throughput but block abuse
const paymentsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment requests. Please slow down.' }
});

module.exports = apiLimiter;
module.exports.authLimiter = authLimiter;
module.exports.paymentsLimiter = paymentsLimiter;
