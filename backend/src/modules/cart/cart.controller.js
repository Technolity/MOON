const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const cartService = require('./cart.service');

function sessionId(req) {
  return req.headers['x-session-id'] || req.query.sessionId || null;
}

const getCart = asyncHandler(async (req, res) => {
  const result = await cartService.getCart({
    user: req.user,
    query: { ...(req.validated?.query ?? req.query), sessionId: sessionId(req) }
  });

  return sendResponse(res, {
    message: 'Cart loaded.',
    data: result
  });
});

const addItem = asyncHandler(async (req, res) => {
  const result = await cartService.addItem({
    user: req.user,
    input: req.validated?.body ?? req.body,
    sessionId: sessionId(req)
  });

  return sendResponse(res, {
    status: 201,
    message: 'Cart item added.',
    data: result
  });
});

const updateItem = asyncHandler(async (req, res) => {
  const result = await cartService.updateItem({
    user: req.user,
    params: req.validated?.params ?? req.params,
    input: req.validated?.body ?? req.body,
    sessionId: sessionId(req)
  });

  return sendResponse(res, {
    message: 'Cart item updated.',
    data: result
  });
});

const removeItem = asyncHandler(async (req, res) => {
  const result = await cartService.removeItem({
    user: req.user,
    params: req.validated?.params ?? req.params,
    sessionId: sessionId(req)
  });

  return sendResponse(res, {
    message: 'Cart item removed.',
    data: result
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const result = await cartService.clearCart({
    user: req.user,
    sessionId: sessionId(req)
  });

  return sendResponse(res, {
    message: 'Cart cleared.',
    data: result
  });
});

module.exports = {
  addItem,
  clearCart,
  getCart,
  removeItem,
  updateItem
};
