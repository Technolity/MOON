const assert = require('node:assert/strict');
const test = require('node:test');

function loadWithMock(modulePath, mocks) {
  const resolvedModule = require.resolve(modulePath);
  const originalModule = require.cache[resolvedModule];
  const originals = new Map();

  for (const [mockPath, exports] of Object.entries(mocks)) {
    const resolvedMock = require.resolve(mockPath);
    originals.set(resolvedMock, require.cache[resolvedMock]);
    require.cache[resolvedMock] = {
      id: resolvedMock,
      filename: resolvedMock,
      loaded: true,
      exports
    };
  }

  delete require.cache[resolvedModule];
  const loaded = require(modulePath);

  return {
    loaded,
    restore() {
      delete require.cache[resolvedModule];
      if (originalModule) {
        require.cache[resolvedModule] = originalModule;
      }

      for (const [resolvedMock, original] of originals.entries()) {
        if (original) {
          require.cache[resolvedMock] = original;
        } else {
          delete require.cache[resolvedMock];
        }
      }
    }
  };
}

test('discount validation applies a capped percentage discount to the checkout subtotal', async () => {
  const { loaded: discountsService, restore } = loadWithMock(
    '../src/modules/discounts/discounts.service',
    {
      '../src/modules/discounts/discounts.repository': {
        normalizeCode: (code) => String(code).trim().toUpperCase(),
        findDiscountByCode: async (code) => {
          assert.equal(code, 'PAYTEST');
          return {
            code: 'PAYTEST',
            type: 'percent',
            value: 50,
            minimum_subtotal: 1000,
            max_discount: 300,
            usage_limit: null,
            usage_count: 0,
            is_active: true,
            starts_at: null,
            ends_at: null
          };
        }
      }
    }
  );

  try {
    const result = await discountsService.validateDiscount({
      code: 'paytest',
      subtotal: 2000,
      shippingCost: 80
    });

    assert.equal(result.code, 'PAYTEST');
    assert.equal(result.discountAmount, 300);
    assert.equal(result.discountedSubtotal, 1700);
    assert.equal(result.totalAfterDiscount, 1780);
  } finally {
    restore();
  }
});

test('discount validation rejects inactive coupons before payment amount is created', async () => {
  const { loaded: discountsService, restore } = loadWithMock(
    '../src/modules/discounts/discounts.service',
    {
      '../src/modules/discounts/discounts.repository': {
        normalizeCode: (code) => String(code).trim().toUpperCase(),
        findDiscountByCode: async () => ({
          code: 'OFFLINE',
          type: 'fixed',
          value: 500,
          minimum_subtotal: 0,
          max_discount: null,
          usage_limit: null,
          usage_count: 0,
          is_active: false,
          starts_at: null,
          ends_at: null
        })
      }
    }
  );

  try {
    await assert.rejects(
      () => discountsService.validateDiscount({ code: 'offline', subtotal: 1200 }),
      (error) => {
        assert.equal(error.statusCode, 400);
        assert.match(error.message, /inactive/i);
        return true;
      }
    );
  } finally {
    restore();
  }
});
