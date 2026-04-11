const ApiError = require('../errors/api-error');

function createNotImplementedAsync(scope, owner, notes) {
  return async function notImplementedPlaceholder() {
    throw new ApiError(501, `${scope} is not implemented yet.`, {
      owner,
      notes
    });
  };
}

module.exports = {
  createNotImplementedAsync
};
