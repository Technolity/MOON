const ApiError = require('../../core/errors/api-error');
const inventoryRepository = require('./inventory.repository');

async function listInventory() {
  return inventoryRepository.listInventory();
}

async function updateInventory({ params, input }) {
  if (!Object.keys(input).length) {
    throw new ApiError(400, 'No fields provided to update.');
  }
  return inventoryRepository.updateInventory(params.id, input);
}

module.exports = { listInventory, updateInventory };
