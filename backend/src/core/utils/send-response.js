function sendResponse(res, { status = 200, message = 'OK', data, meta } = {}) {
  const payload = {
    success: status < 400,
    message
  };

  if (typeof data !== 'undefined') {
    payload.data = data;
  }

  if (typeof meta !== 'undefined') {
    payload.meta = meta;
  }

  return res.status(status).json(payload);
}

module.exports = sendResponse;
