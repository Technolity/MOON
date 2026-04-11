const express = require('express');

const {
  requireAdmin,
  requireAuth
} = require('../../core/middleware/require-auth');
const validateRequest = require('../../core/middleware/validate-request');
const inventoryController = require('./inventory.controller');
const {
  inventoryParamsSchema,
  updateInventorySchema
} = require('./inventory.validator');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', inventoryController.listInventory);
router.put(
  '/:id',
  validateRequest({
    params: inventoryParamsSchema,
    body: updateInventorySchema
  }),
  inventoryController.updateInventory
);

module.exports = router;
