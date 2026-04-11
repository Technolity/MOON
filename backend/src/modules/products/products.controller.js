const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const productsService = require('./products.service');

const listProducts = asyncHandler(async (req, res) => {
  const result = await productsService.listProducts(req.validated?.query ?? req.query);

  return sendResponse(res, {
    message: 'Products loaded.',
    data: result
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const result = await productsService.getProductById(
    req.validated?.params ?? req.params
  );

  return sendResponse(res, {
    message: 'Product loaded.',
    data: result
  });
});

const searchProducts = asyncHandler(async (req, res) => {
  const result = await productsService.searchProducts(
    req.validated?.query ?? req.query
  );

  return sendResponse(res, {
    message: 'Product search complete.',
    data: result
  });
});

module.exports = {
  getProductById,
  listProducts,
  searchProducts
};
