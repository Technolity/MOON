const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');

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

test('products service accepts route params and queries repository by slug string', async () => {
  let receivedId;
  const { loaded: productsService, restore } = loadWithMock(
    '../src/modules/products/products.service',
    {
      '../src/modules/products/products.repository': {
        findProductById: async (id) => {
          receivedId = id;
          return { id: 'product-1', slug: id };
        }
      }
    }
  );

  try {
    const product = await productsService.getProductById({ id: 'kashmiri-saffron' });

    assert.equal(receivedId, 'kashmiri-saffron');
    assert.equal(product.slug, 'kashmiri-saffron');
  } finally {
    restore();
  }
});

test('geo analytics joins the real addresses table through the shipping address relationship', async () => {
  let selectedColumns = '';
  const query = {
    select(columns) {
      selectedColumns = columns;
      return this;
    },
    in() {
      return this;
    },
    then(resolve) {
      resolve({ data: [], error: null });
    }
  };

  const { loaded: detailedRepository, restore } = loadWithMock(
    '../src/modules/analytics/analytics.detailed.repository',
    {
      '../src/integrations/database/supabase-admin': {
        getSupabaseAdminClient: () => ({
          from(tableName) {
            assert.equal(tableName, 'orders');
            return query;
          }
        })
      }
    }
  );

  try {
    await detailedRepository.getGeoBreakdown();

    assert.match(selectedColumns, /shipping_address:addresses!orders_shipping_address_id_fkey/);
    assert.doesNotMatch(selectedColumns, /shipping_addresses/);
  } finally {
    restore();
  }
});

test('default JWT lifetime matches the admin console session expectation', () => {
  const previousJwtExpiresIn = process.env.JWT_EXPIRES_IN;
  delete process.env.JWT_EXPIRES_IN;
  delete require.cache[require.resolve('../src/config/env')];

  try {
    const env = require('../src/config/env');
    assert.equal(env.auth.jwtExpiresIn, '7d');
  } finally {
    if (previousJwtExpiresIn == null) {
      delete process.env.JWT_EXPIRES_IN;
    } else {
      process.env.JWT_EXPIRES_IN = previousJwtExpiresIn;
    }
    delete require.cache[require.resolve('../src/config/env')];
  }
});

test('quick Razorpay order maps upstream authentication failures to a debuggable API error', async () => {
  const upstreamError = {
    statusCode: 401,
    error: {
      code: 'BAD_REQUEST_ERROR',
      description: 'Authentication failed'
    }
  };

  const { loaded: paymentsService, restore } = loadWithMock(
    '../src/modules/payments/payments.service',
    {
      '../src/integrations/payments/razorpay.client': {
        getRazorpayClient: () => ({
          orders: {
            create: async () => {
              throw upstreamError;
            }
          }
        })
      }
    }
  );

  try {
    await assert.rejects(
      () => paymentsService.quickOrder({ amount: 100, currency: 'INR', receipt: 'debug-receipt' }),
      (error) => {
        assert.equal(error.statusCode, 502);
        assert.match(error.message, /Payment gateway authentication failed/);
        assert.equal(error.details.providerStatusCode, 401);
        assert.equal(error.details.providerCode, 'BAD_REQUEST_ERROR');
        return true;
      }
    );
  } finally {
    restore();
  }
});

test('admin product image updates accept the admin app images envelope', async () => {
  let capturedPatch;
  const { loaded: productAdminRouter, restore } = loadWithMock(
    '../src/modules/products/products.admin.routes',
    {
      '../src/core/middleware/require-auth': {
        requireAuth: (req, _res, next) => {
          req.user = { id: 'admin-user' };
          next();
        },
        requireAdmin: (_req, _res, next) => next()
      },
      '../src/integrations/revalidate': {
        revalidateStorefront: async () => {}
      },
      '../src/modules/products/products.repository': {
        adminUpdateProduct: async (id, patch) => {
          capturedPatch = { id, patch };
          return { id, slug: 'pure-shilajit' };
        }
      }
    }
  );

  const app = express();
  app.use(express.json());
  app.use('/admin/products', productAdminRouter);

  const server = app.listen(0);
  try {
    const port = server.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/admin/products/product-1/images`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        images: [
          {
            url: 'https://example.com/product.png',
            alt: 'Product image',
            order: 0,
            blurDataUrl: null
          }
        ]
      })
    });

    assert.equal(response.status, 200);
    assert.equal(capturedPatch.id, 'product-1');
    assert.equal(capturedPatch.patch.updated_by, 'admin-user');
    assert.deepEqual(capturedPatch.patch.images, [
      {
        url: 'https://example.com/product.png',
        alt: 'Product image',
        order: 0,
        blurDataUrl: null
      }
    ]);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    restore();
  }
});

test('admin product upload returns the shared API envelope expected by the admin app', async () => {
  let uploadedObject;
  const { loaded: productUploadRouter, restore } = loadWithMock(
    '../src/modules/products/products.upload.routes',
    {
      '../src/core/middleware/require-auth': {
        requireAuth: (req, _res, next) => {
          req.user = { id: 'admin-user', role: 'admin' };
          req.log = () => {};
          next();
        },
        requireAdmin: (_req, _res, next) => next()
      },
      '../src/integrations/database/supabase-admin': {
        getSupabaseAdminClient: () => ({
          storage: {
            from(bucket) {
              assert.equal(bucket, 'product-images');
              return {
                async upload(filename, buffer, options) {
                  uploadedObject = { filename, byteLength: buffer.length, contentType: options.contentType };
                  return { error: null };
                },
                getPublicUrl(filename) {
                  return {
                    data: {
                      publicUrl: `https://example.supabase.co/storage/v1/object/public/product-images/${filename}`
                    }
                  };
                }
              };
            }
          }
        })
      }
    }
  );

  const app = express();
  app.use('/admin/products', productUploadRouter);

  const server = app.listen(0);
  try {
    const port = server.address().port;
    const form = new FormData();
    const tinyPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
      'base64'
    );

    form.append('images', new Blob([tinyPng], { type: 'image/png' }), 'tiny.png');

    const response = await fetch(`http://127.0.0.1:${port}/admin/products/product-1/upload`, {
      method: 'POST',
      body: form
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, 'Product images uploaded.');
    assert.equal(body.data.images.length, 1);
    assert.match(body.data.images[0].url, /product-images\/product-1\//);
    assert.equal(body.data.images[0].order, 0);
    assert.equal(body.data.images[0].blurDataUrl.startsWith('data:image/webp;base64,'), true);
    assert.equal(uploadedObject.contentType, 'image/webp');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    restore();
  }
});
