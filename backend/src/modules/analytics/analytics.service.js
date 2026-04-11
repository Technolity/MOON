const analyticsRepository = require('./analytics.repository');

async function getDashboard(query = {}) {
  return analyticsRepository.getDashboardSummary(query);
}

async function getOrderMetrics(query = {}) {
  return analyticsRepository.getOrderMetrics(query);
}

async function getRevenueMetrics(query = {}) {
  return analyticsRepository.getRevenueMetrics(query);
}

async function getCustomerMetrics(query = {}) {
  return analyticsRepository.getCustomerMetrics(query);
}

async function getProductMetrics(query = {}) {
  return analyticsRepository.getProductMetrics(query);
}

module.exports = { getCustomerMetrics, getDashboard, getOrderMetrics, getProductMetrics, getRevenueMetrics };
