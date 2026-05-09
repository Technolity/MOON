const jwt = require('jsonwebtoken');

const env = require('../../config/env');
const USER_ROLES = require('../../constants/user-roles');
const ApiError = require('../errors/api-error');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    if (req.log) {
      req.log('auth:missing-bearer-token', { authScheme: scheme || null }, 'warn');
    }

    return next(new ApiError(401, 'Authentication required.'));
  }

  try {
    req.user = jwt.verify(token, env.auth.jwtSecret);
    if (req.log) {
      req.log('auth:verified', { user: req.user });
    }

    return next();
  } catch (error) {
    if (req.log) {
      req.log('auth:invalid-token', { error }, 'warn');
    }

    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    if (req.log) {
      req.log('auth:admin-missing-user', {}, 'warn');
    }

    return next(new ApiError(401, 'Authentication required.'));
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    if (req.log) {
      req.log('auth:admin-role-rejected', { user: req.user }, 'warn');
    }

    return next(new ApiError(403, 'Admin access required.'));
  }

  if (req.log) {
    req.log('auth:admin-accepted', { user: req.user });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin
};
