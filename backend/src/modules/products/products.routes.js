const express = require('express');

const validateRequest = require('../../core/middleware/validate-request');
const productsController = require('./products.controller');
const {
  listProductsQuerySchema,
  productParamsSchema,
  searchProductsQuerySchema
} = require('./products.validator');

const router = express.Router();

router.get('/', validateRequest({ query: listProductsQuerySchema }), productsController.listProducts);
router.get(
  '/search',
  validateRequest({ query: searchProductsQuerySchema }),
  productsController.searchProducts
);
router.get(
  '/:id',
  validateRequest({ params: productParamsSchema }),
  productsController.getProductById
);

module.exports = router;
