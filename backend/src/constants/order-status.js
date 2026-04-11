const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
});

module.exports = ORDER_STATUS;
