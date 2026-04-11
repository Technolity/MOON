const jwt = require('jsonwebtoken');

const env = require('../../config/env');
const USER_ROLES = require('../../constants/user-roles');
const ApiError = require('../errors/api-error');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  try {
    req.user = jwt.verify(token, env.auth.jwtSecret);
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return next(new ApiError(403, 'Admin access required.'));
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin
};
