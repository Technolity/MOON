const ApiError = require('../../core/errors/api-error');
const productsRepository = require('./products.repository');

async function listProducts({ category, theme, limit } = {}) {
  return productsRepository.listProducts({ category, theme, limit });
}

async function getProductById(id) {
  const product = await productsRepository.findProductById(id);
  if (!product) throw new ApiError(404, 'Product not found.');
  return product;
}

async function searchProducts({ q, limit } = {}) {
  return productsRepository.searchProducts({ q, limit });
}

module.exports = { getProductById, listProducts, searchProducts };
