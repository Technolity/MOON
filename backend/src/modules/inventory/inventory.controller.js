const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const inventoryService = require('./inventory.service');

const listInventory = asyncHandler(async (req, res) => {
  const result = await inventoryService.listInventory(req.query);

  return sendResponse(res, {
    message: 'Inventory loaded.',
    data: result
  });
});

const updateInventory = asyncHandler(async (req, res) => {
  const result = await inventoryService.updateInventory({
    params: req.validated?.params ?? req.params,
    input: req.validated?.body ?? req.body
  });

  return sendResponse(res, {
    message: 'Inventory updated.',
    data: result
  });
});

module.exports = {
  listInventory,
  updateInventory
};
