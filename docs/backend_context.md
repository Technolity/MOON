# Backend Context

This file is the backend memory ledger for the MOON repository.

## Intent

- Keep one source of truth for backend structure and file ownership.
- Prevent duplicate business logic across controllers, services, repositories, validators, and SQL.
- Make future backend work additive and predictable.

## Rules

- Update this file every time a backend or database file is added, removed, renamed, or materially repurposed.
- Controllers only translate HTTP input/output.
- Services own business rules and orchestration.
- Repositories own database reads and writes only.
- Validators own request shape validation only.
- Integration clients own SDK bootstrapping only.
- SQL migrations are the schema source of truth.
- SQL seed files are the bootstrap data source of truth.

## File Ledger

### Root Documentation

- `docs/backend_context.md`: Canonical memory log for backend and database file ownership. Updated whenever backend or database files are added, removed, renamed, or materially repurposed.
- `docs/CLAUDE.md`: Repo-level operating instructions covering architecture, running instructions, security model, DevOps setup, and known gaps.
- `docs/SEO_Optimisation.md`: Code SEO checklist tracking what has been completed on the static HTML frontend and what remains for the React/Next.js migration. Includes keyword list, JSON-LD schema status, and post-launch roadmap.
- `docs/DEVOPS.md`: Step-by-step guide for Railway (backend), Vercel (frontend), GitHub Actions CI/CD, domain DNS, and daily deployment workflow.

### Root Configuration

- `vercel.json`: Vercel deployment config for the static frontend. Routes `/api/*` to the Railway backend (placeholder URL), serves static assets, and sets cache headers.
- `.gitignore`: Excludes node_modules, all .env variants, .claude, dist, logs, OS files, editor folders, coverage, and Vercel/Railway local files.
- `robots.txt`: Allows full crawl; references sitemap at `https://moonnaturallyyours.com/sitemap.xml`.
- `sitemap.xml`: XML sitemap with homepage entry. Needs expanding once additional pages are live.

### CI/CD Workflows

- `.github/workflows/ci.yml`: Runs on every branch push and on PRs to main. Steps: checkout, Node 20, `npm ci`, syntax check (`node --check`), module load check with placeholder env vars, `npm audit --audit-level=high`.
- `.github/workflows/deploy.yml`: Runs on push to main only. Runs the same backend check first, then deploys backend via Railway CLI and frontend via Vercel CLI in parallel — both gated on the check job passing.

### Backend Top Level

- `backend/package.json`: Declares the backend runtime, scripts, and dependencies. Dependencies: express, @supabase/supabase-js, razorpay, resend, bcryptjs, jsonwebtoken, zod, helmet, express-rate-limit, cors, morgan, dotenv. devDependencies: nodemon.
- `backend/.env.example`: Documents the full environment contract: NODE_ENV, PORT, FRONTEND_URL, JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RAZORPAY_KEY, RAZORPAY_SECRET, RAZORPAY_WEBHOOK_SECRET, RESEND_API_KEY, EMAIL_FROM.
- `backend/railway.toml`: Railway deployment config. Builder: NIXPACKS, install: `npm ci --omit=dev`, start: `npm start`, healthcheck: `/api/health`, restart policy: ON_FAILURE max 3 retries.
- `backend/README.md`: Human-readable backend bootstrap guide.

### Backend Bootstrap

- `backend/src/app.js`: Express application composition. Configures: `trust proxy 1`, Helmet with explicit CSP (defaultSrc/scriptSrc self, objectSrc/frameSrc none), HSTS (31536000s + preload), referrer strict-origin-when-cross-origin; body limits (json+urlencoded 100kb); Morgan logging (dev format in dev, minimal `:method :url :status` in production); CORS; three rate-limit tiers applied per route group; all module routes; 404 handler; error handler.
- `backend/src/server.js`: HTTP server entrypoint. Calls `validateEnv()` first before any other require. Registers `unhandledRejection` and `uncaughtException` handlers (both log and call `process.exit(1)`).

### Backend Config

- `backend/src/config/env.js`: Reads and normalizes all environment variables. Exports `validateEnv()` — in production, exits immediately if `JWT_SECRET` is missing, equals the insecure placeholder `'replace-this-before-production'`, or is under 32 characters; also exits if `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` are missing. JWT defaults: 15m access / 7d refresh.
- `backend/src/config/cors.js`: CORS policy. Allows configured `FRONTEND_URL` origin. In production, blocks requests with no `Origin` header with a 403 error. In development, allows no-origin requests for local tooling.

### Backend Constants

- `backend/src/constants/order-status.js`: Canonical order status values (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED).
- `backend/src/constants/payment-status.js`: Canonical payment status values (PENDING, CAPTURED, FAILED, REFUNDED).
- `backend/src/constants/user-roles.js`: Canonical user role values (CUSTOMER, ADMIN).

### Backend Core Errors, Middleware, and Utilities

- `backend/src/core/errors/api-error.js`: Shared application error type with `statusCode`, `message`, `details`.
- `backend/src/core/middleware/error-handler.js`: Final Express error serializer. In production: returns generic "Internal server error." for 5xx errors (no internal details exposed), returns validation details only for 4xx. In development: exposes `err.message` as `body.detail`. Only logs 5xx errors to stderr.
- `backend/src/core/middleware/not-found.js`: Unknown-route middleware. Returns 404 JSON.
- `backend/src/core/middleware/rate-limit.js`: Three exported rate limiters — `apiLimiter` (default, 100 req/15min, applied globally), `authLimiter` (named, 10 req/15min, applied to register/login/refresh-token), `paymentsLimiter` (named, 20 req/5min, applied to payment create/verify). All return custom JSON error messages.
- `backend/src/core/middleware/require-auth.js`: Auth guard (`requireAuth`) and admin guard (`requireAdmin`). Verifies JWT access token from `Authorization: Bearer` header. Sets `req.user`.
- `backend/src/core/middleware/validate-request.js`: Zod-backed request validation middleware. Reusable across all modules.
- `backend/src/core/utils/async-handler.js`: Promise-safe route wrapper — eliminates try/catch in controllers.
- `backend/src/core/utils/not-implemented.js`: Placeholder handler factory — returns 501 for any unfinished method.
- `backend/src/core/utils/send-response.js`: Shared API response serializer — uniform `{ success, data }` envelope.

### Backend Integration Clients

- `backend/src/integrations/database/supabase-admin.js`: Lazy Supabase service-role client. Initialized on first call using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
- `backend/src/integrations/notifications/resend.client.js`: Lazy Resend email client. `getResendClient()` returns a `new Resend(RESEND_API_KEY)` instance, or `null` if key is missing. Email provider for order confirmations.
- `backend/src/integrations/notifications/sendgrid.client.js`: Tombstoned — `getSendgridClient()` returns `null`. Replaced by Resend. File kept to avoid import errors.
- `backend/src/integrations/notifications/twilio.client.js`: Present but unused. SMS/WhatsApp handled manually via brand community channel.
- `backend/src/integrations/payments/razorpay.client.js`: Lazy Razorpay client using `RAZORPAY_KEY` + `RAZORPAY_SECRET`.

### Backend Module Registry

- `backend/src/modules/index.js`: API route registry. Maps all module routers to their `/api/*` prefixes.

### Health Module

- `backend/src/modules/health/health.routes.js`: `GET /api/health` routing.
- `backend/src/modules/health/health.controller.js`: Returns `{ status: 'ok', timestamp, uptime }`.

### Auth Module

- `backend/src/modules/auth/auth.routes.js`: Auth route declarations for `/api/auth/*`. `authLimiter` applied to `/register`, `/login`, `/refresh-token`. `requireAuth` applied to `/logout` and `/me`.
- `backend/src/modules/auth/auth.controller.js`: Auth HTTP adapter — parses request, calls service, sends response.
- `backend/src/modules/auth/auth.service.js`: Auth business logic. `register`: hashes password with bcryptjs (12 rounds), calls repository to create user, returns signed tokens. `login`: fetches user by email, compares bcrypt hash, returns tokens. `logout`: stateless — returns `{}`. `refreshToken`: verifies refresh JWT, re-signs and returns new access + refresh tokens. `getProfile`: fetches user by ID.
- `backend/src/modules/auth/auth.repository.js`: Auth persistence. `findUserByEmail`, `findUserById`, `createUser` — all via Supabase client against the `users` table.
- `backend/src/modules/auth/auth.validator.js`: Zod schemas for register, login, and refresh-token payloads.

### Products Module

- `backend/src/modules/products/products.routes.js`: Product route declarations for `/api/products/*`.
- `backend/src/modules/products/products.controller.js`: Product HTTP adapter.
- `backend/src/modules/products/products.service.js`: Product business logic. `listProducts`: delegates to repository. `getProduct`: fetches by UUID or slug, throws 404 if not found. `searchProducts`: delegates to repository.
- `backend/src/modules/products/products.repository.js`: Product persistence. `listProducts` (filterable by category/theme/limit), `findProductById` (accepts UUID or slug), `searchProducts` (ilike on name/description), `findProductsByIds` (bulk load for order creation).
- `backend/src/modules/products/products.validator.js`: Zod schemas for list/search query params and product ID param.

### Cart Module

- `backend/src/modules/cart/cart.routes.js`: Cart route declarations for `/api/cart/*`. All routes require `requireAuth` or accept guest via `x-session-id` header.
- `backend/src/modules/cart/cart.controller.js`: Cart HTTP adapter. Extracts `x-session-id` header via `sessionId(req)` helper and passes to service alongside `req.user`.
- `backend/src/modules/cart/cart.service.js`: Cart business logic. `cartKey` helper resolves user_id or session_id. `getCart`: retrieves cart from DB. `addItem`: merges quantity if item already exists, assigns `randomUUID()` as itemId, upserts cart. `updateItem`: patches quantity on existing item. `removeItem`: filters item out of JSONB array. `clearCart`: wipes all items.
- `backend/src/modules/cart/cart.repository.js`: Cart persistence. `getCart`, `upsertCart` (onConflict user_id or session_id), `deleteCart` — backed by the `carts` JSONB table from migration 0004.
- `backend/src/modules/cart/cart.validator.js`: Zod schemas for add-item, update-item, and remove-item payloads.

### Orders Module

- `backend/src/modules/orders/orders.routes.js`: Order route declarations for `/api/orders/*`. All routes require `requireAuth`. Admin-only routes require `requireAdmin`.
- `backend/src/modules/orders/orders.controller.js`: Order HTTP adapter.
- `backend/src/modules/orders/orders.service.js`: Order business logic. `createOrder`: loads product records from DB (never trusts client-supplied prices), builds line items with DB prices, calculates shipping via shipping service, creates shipping address, creates order + order items in a single DB call, reserves inventory via RPC (non-fatal). Generates order number `MOON-YYYYMMDD-XXXX`. `getOrderById`: customers may only view their own orders; admins see all. `listOrders`, `updateOrderStatus`: delegates to repository.
- `backend/src/modules/orders/orders.repository.js`: Order persistence. `createAddress`, `createOrder` (with `order_items`), `getOrderById` (joined with items + payments), `listOrdersByUser`, `updateStatus`, `reserveInventory` (calls `increment_reserved` RPC, logs but does not throw on failure).
- `backend/src/modules/orders/orders.validator.js`: Zod schemas for checkout payload and admin status-update payload.

### Payments Module

- `backend/src/modules/payments/payments.routes.js`: Payment route declarations for `/api/payments/*`. `requireAuth` applied at router level (all payment routes). `paymentsLimiter` applied to `/create` and `/verify`.
- `backend/src/modules/payments/payments.controller.js`: Payment HTTP adapter.
- `backend/src/modules/payments/payments.service.js`: Payment business logic. `createRazorpayOrder`: creates a Razorpay order in paise (amount × 100), upserts a `payments` record with status PENDING. `verifyPayment`: computes `HMAC-SHA256(razorpayKeySecret, orderId+'|'+paymentId)`, compares against `razorpay_signature` from client — throws 400 on mismatch; on success, updates payment to CAPTURED and advances order to CONFIRMED. `getPaymentStatus`: delegates to repository.
- `backend/src/modules/payments/payments.repository.js`: Payment persistence. `createPayment`, `updatePayment`, `getPaymentByOrderId` — against the `payments` table.
- `backend/src/modules/payments/payments.validator.js`: Zod schemas for create-order and verify-payment payloads.

### Shipping Module

- `backend/src/modules/shipping/shipping.routes.js`: Shipping route declarations for `/api/shipping/*`.
- `backend/src/modules/shipping/shipping.controller.js`: Shipping HTTP adapter.
- `backend/src/modules/shipping/shipping.service.js`: Shipping business logic. `FREE_SHIPPING_THRESHOLD = 999` INR. `calculateShipping`: looks up zone by state, returns `{ cost, estimatedDays, isFree }`. Orders ≥ ₹999 always get free shipping. `listZones`: delegates to repository.
- `backend/src/modules/shipping/shipping.repository.js`: Shipping persistence. `listZones`, `findZoneByState` (uses `.contains('states', [state])` on the `shipping_zones` table from seed 0002).
- `backend/src/modules/shipping/shipping.validator.js`: Zod schemas for shipping calculation inputs (state, cart total).

### Notifications Module

- `backend/src/modules/notifications/notifications.routes.js`: Notification route declarations for `/api/notifications/*`.
- `backend/src/modules/notifications/notifications.controller.js`: Notification HTTP adapter.
- `backend/src/modules/notifications/notifications.service.js`: Notification business logic. `sendEmail`: sends via Resend client using `EMAIL_FROM` env var; gracefully returns `{ sent: false }` if Resend key is missing. `sendOrderConfirmation`: convenience wrapper over `sendEmail` with order summary template. `sendSms` and `sendWhatsApp`: return `{ queued: false, reason: 'SMS/WhatsApp handled manually via community channel' }`.
- `backend/src/modules/notifications/notifications.validator.js`: Zod schemas for outbound email payloads.

### Analytics Module

- `backend/src/modules/analytics/analytics.routes.js`: Admin analytics route declarations for `/api/admin/analytics/*`. All routes require `requireAdmin`.
- `backend/src/modules/analytics/analytics.controller.js`: Analytics HTTP adapter.
- `backend/src/modules/analytics/analytics.service.js`: Analytics business logic. Delegates to repository for all aggregations; accepts optional `startDate`/`endDate` filters and passes them through.
- `backend/src/modules/analytics/analytics.repository.js`: Analytics persistence. `getDashboardSummary`: total orders, total revenue (confirmed+ statuses), unique customer count, low-stock product count. `getOrderMetrics`: order counts by status. `getRevenueMetrics`: average order value. `getCustomerMetrics`: new vs. returning customers. All queries accept date-range params.
- `backend/src/modules/analytics/analytics.validator.js`: Zod schemas for date-range query params.

### Inventory Module

- `backend/src/modules/inventory/inventory.routes.js`: Inventory route declarations for `/api/inventory/*`. All routes require `requireAdmin`.
- `backend/src/modules/inventory/inventory.controller.js`: Inventory HTTP adapter.
- `backend/src/modules/inventory/inventory.service.js`: Inventory business logic. `listInventory`: delegates to repository. `updateInventory`: validates item exists, delegates patch to repository.
- `backend/src/modules/inventory/inventory.repository.js`: Inventory persistence. `listInventory` (joined with products table for name + SKU), `updateInventory` (patch by inventory ID — quantity, reserved, reorder_threshold).
- `backend/src/modules/inventory/inventory.validator.js`: Zod schemas for inventory update payloads.

### Database Files

- `database/README.md`: Database execution guide with ordered migration and seed run steps.
- `database/migrations/0001_extensions.sql`: Enables `pgcrypto` and `citext` extensions before schema creation.
- `database/migrations/0002_core_schema.sql`: Core schema — all tables, enums, relationships, and indexes (users, products, orders, order_items, payments, inventory, shipping_zones, addresses).
- `database/migrations/0003_updated_at_triggers.sql`: Adds `updated_at` auto-update trigger to all tables.
- `database/migrations/0004_carts.sql`: `carts(id, user_id, session_id, items jsonb, created_at, updated_at)`. Unique index on `user_id` (where not null), regular index on `session_id`. Supports both authenticated users and guests (via `x-session-id` header).
- `database/migrations/0005_inventory_rpc.sql`: `increment_reserved(p_product_id uuid, p_quantity integer)` Postgres function. Atomically increments the `reserved` column; raises `check_violation` if `quantity - reserved < p_quantity`. Called by orders service on order creation (non-fatal: logs but does not block order).
- `database/seeds/0001_products.sql`: 3 products (Kashmiri Saffron, Sidr Honey, Shilajit) with matching inventory rows.
- `database/seeds/0002_shipping_zones.sql`: India shipping zones with per-zone rates and state arrays.
