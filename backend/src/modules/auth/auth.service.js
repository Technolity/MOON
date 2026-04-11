const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const env = require('../../config/env');
const ApiError = require('../../core/errors/api-error');
const authRepository = require('./auth.repository');

function signToken(payload) {
  return jwt.sign(payload, env.auth.jwtSecret, { expiresIn: env.auth.jwtExpiresIn });
}

async function register({ email, password, phone, firstName, lastName }) {
  const existing = await authRepository.findUserByEmail(email);
  if (existing) throw new ApiError(409, 'Email already registered.');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await authRepository.createUser({ email, passwordHash, phone, firstName, lastName });

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return { token, user };
}

async function login({ email, password }) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid credentials.');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new ApiError(401, 'Invalid credentials.');

  const { password_hash, ...safeUser } = user;
  const token = signToken({ sub: safeUser.id, email: safeUser.email, role: safeUser.role });
  return { token, user: safeUser };
}

async function logout() {
  // Stateless JWT — client discards the token.
  return {};
}

async function refreshToken({ refreshToken: rt }) {
  if (!rt) throw new ApiError(400, 'Refresh token required.');

  let payload;
  try {
    payload = jwt.verify(rt, env.auth.jwtSecret);
  } catch {
    throw new ApiError(401, 'Invalid or expired token.');
  }

  const token = signToken({ sub: payload.sub, email: payload.email, role: payload.role });
  return { token };
}

async function getProfile(user) {
  if (!user) throw new ApiError(401, 'Authentication required.');
  const profile = await authRepository.findUserById(user.sub);
  if (!profile) throw new ApiError(404, 'User not found.');
  return profile;
}

module.exports = { getProfile, login, logout, refreshToken, register };
