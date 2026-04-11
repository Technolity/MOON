const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated?.body ?? req.body);

  return sendResponse(res, {
    status: 201,
    message: 'Registration complete.',
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated?.body ?? req.body);

  return sendResponse(res, {
    message: 'Login complete.',
    data: result
  });
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout({
    user: req.user,
    authorization: req.headers.authorization || ''
  });

  return sendResponse(res, {
    message: 'Logout complete.',
    data: result
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.validated?.body ?? req.body);

  return sendResponse(res, {
    message: 'Token refreshed.',
    data: result
  });
});

const me = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user);

  return sendResponse(res, {
    message: 'Profile loaded.',
    data: result
  });
});

module.exports = {
  login,
  logout,
  me,
  refreshToken,
  register
};
