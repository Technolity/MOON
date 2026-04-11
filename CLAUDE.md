# CLAUDE.md

This file is the single source of truth for all contributors and Claude Code sessions on this repository.

---

## Repository Structure

```
MOON/
  frontend/        ← React + TypeScript + Vite (active storefront + admin UI)
  backend/         ← Node.js + Express API (fully implemented)
  database/        ← Supabase SQL migrations and seeds
  docs/            ← Architecture docs, SEO checklist, DevOps guide, context ledger
  .github/         ← GitHub Actions CI/CD workflows
  index.html       ← Legacy static prototype (do not extend — frontend/ is the live UI)
```

---

## Running the Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in VITE_API_URL and VITE_ADMIN_OWNER_EMAIL
npm run dev
# visits http://localhost:5173
```

Build for production:
```bash
cd frontend
npm run build
```

### Frontend Environment Variables

Create `frontend/.env.local` from `frontend/.env.example`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL. Defaults to `http://localhost:5000/api` if omitted |
| `VITE_ADMIN_OWNER_EMAIL` | Prefills the admin login form only — not used for authentication |

---

## Running the Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in real values
npm run dev
# health check: http://localhost:5000/api/health
```

The server prints warnings on startup if optional env vars are missing.
It **exits immediately** if run with `NODE_ENV=production` and secrets are absent or insecure.

### Backend Environment Variables

See `backend/.env.example` for the full list. Required in production:

| Variable | Notes |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | 64+ random characters |
| `SUPABASE_URL` | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (not anon key) |
| `RAZORPAY_KEY` | Live key (use test key locally) |
| `RAZORPAY_SECRET` | — |
| `RESEND_API_KEY` | For order confirmation emails |
| `EMAIL_FROM` | `orders@moonnaturallyyours.com` |
| `FRONTEND_URL` | `https://moonnaturallyyours.com` |

---

## Frontend Architecture

### Stack
React 18 + TypeScript + Vite + Tailwind CSS + Redux Toolkit + React Router v7

### Entry and Shell
- `frontend/src/main.tsx` — React root, Redux `<Provider>`
- `frontend/src/App.tsx` — routing, admin route guard, cart drawer, app-level event wiring

### Pages
| File | Route | Description |
|---|---|---|
| `pages/HomePage.tsx` | `/` | Cinematic storefront landing with frame-sequence hero |
| `pages/CartPage.tsx` | `/cart` | Full-page cart |
| `pages/CheckoutPage.tsx` | `/checkout` | Checkout flow, shipping calculator, order creation |
| `pages/admin/AdminLoginPage.tsx` | `/admin/login` | Owner login — calls `POST /api/auth/login` |
| `pages/admin/DashboardOverviewPage.tsx` | `/admin/dashboard-overview` | Revenue, orders, customer KPIs |
| `pages/admin/AnalyticsFocusPage.tsx` | `/admin/analytics-focus` | Order metrics, product sales, revenue charts |
| `pages/admin/InventoryPage.tsx` | `/admin/inventory` | Stock levels, inline quantity edit |

### Shared Components
- `frontend/src/components/Navbar.tsx`
- `frontend/src/components/Footer.tsx`
- `frontend/src/components/CartDrawer.tsx`

### State and API Layer
- `frontend/src/store/index.ts` — Redux store setup
- `frontend/src/store/slices/cartSlice.ts` — cart state (guest session ID managed here)
- `frontend/src/store/services/api.ts` — RTK Query endpoints wired to all backend routes
- `frontend/src/store/services/cartSession.ts` — session ID generation and persistence
- `frontend/src/data/products.ts` — local product catalog and stories (used for UI fallback)

### Admin Auth
- `frontend/src/admin/adminAuth.ts` — JWT stored in `localStorage` under `moon_admin_owner_session_v2`
- `frontend/src/admin/RequireAdmin.tsx` — route guard; redirects to `/admin/login` if no valid admin session
- Admin login calls `POST /api/auth/login` — the JWT returned is what protects all admin API calls

### Hooks
- `frontend/src/hooks/useStorytellingCanvas.ts` — hero frame-sequence canvas animation (192 JPEGs per product)
- `frontend/src/hooks/useRevealAnimation.ts` — intersection-based scroll reveal

### Styling
- `frontend/src/styles/global.css` — Tailwind layers + project CSS imports
- `frontend/src/styles/style.css` — core custom styles
- `frontend/src/styles/animations.css` — keyframe animations
- `frontend/tailwind.config.cjs` — cinematic design tokens, font mapping

### Asset Layout
Frame animation folders must be under `frontend/public/`:
```
frontend/public/moon333/              → shilajit (192 frames)
frontend/public/moon2222/             → saffron (192 frames)
frontend/public/ezgif-2fae6b36993927b6-jpg/  → honey (192 frames)
```
Frame naming: `ezgif-frame-001.jpg` … `ezgif-frame-192.jpg`

---

## Backend Architecture

All modules are **fully implemented** — no 501 stubs remain.

| Module | Endpoints | Notes |
|---|---|---|
| health | `GET /api/health` | Always live |
| auth | register, login, logout, refresh-token, me | bcryptjs 12 rounds + JWT (15 min access / 7 day refresh) |
| products | list, search, getById | Supabase queries, UUID or slug lookup |
| cart | get, add, update, remove, clear | JSONB-backed, user or guest (`x-session-id` header) |
| shipping | calculate, listZones | Zone match by state, free above ₹999 |
| orders | create, list, getById, updateStatus | DB prices enforced, inventory reserved on creation |
| payments | createRazorpayOrder, verify, getStatus | HMAC-SHA256 signature verification, auto-confirms order |
| notifications | sendEmail | Resend only — SMS/WhatsApp manual via community |
| inventory | list, update | Admin only |
| analytics | dashboard, orders, revenue, customers, products | Admin only, date-range filterable |

### Integration Clients
- **Supabase** — `backend/src/integrations/database/supabase-admin.js` (lazy, service role)
- **Razorpay** — `backend/src/integrations/payments/razorpay.client.js` (lazy)
- **Resend** — `backend/src/integrations/notifications/resend.client.js` (lazy) — email only
- **SendGrid** — tombstoned, returns null stub
- **Twilio** — file present but unused; SMS/WhatsApp handled manually

---

## Database

Migrations run in order via Supabase SQL Editor:

| File | What it creates |
|---|---|
| `0001_extensions.sql` | `pgcrypto`, `citext` |
| `0002_core_schema.sql` | All tables, enums, indexes |
| `0003_updated_at_triggers.sql` | `updated_at` auto-trigger on all tables |
| `0004_carts.sql` | `carts` table (user + guest session, JSONB items) |
| `0005_inventory_rpc.sql` | `increment_reserved()` Postgres function |
| `seeds/0001_products.sql` | 3 products + inventory rows |
| `seeds/0002_shipping_zones.sql` | India shipping zones |

---

## Security

- `env.js` validates all critical secrets at startup — exits in production if missing or insecure
- JWT access tokens expire in 15 minutes; refresh tokens in 7 days
- Three rate limit tiers: general API (100/15 min), auth (10/15 min), payments (20/5 min)
- Helmet with explicit CSP, HSTS (1 year + preload), referrer strict-origin-when-cross-origin
- CORS blocks no-origin requests in production
- Body size capped at 100kb
- Error handler never leaks internal messages in production
- `trust proxy 1` set for accurate IP rate-limiting behind Vercel

---

## DevOps

- **Frontend + Backend** → both served by **Vercel** (free tier)
  - Frontend: static files from repo root / `frontend/`
  - Backend: Express app as a serverless function via `backend/api/index.js`
  - API routes (`/api/*`) are routed to the serverless function in `vercel.json`
- **Database** → Supabase (free tier)
- **CI/CD** → GitHub Actions (`.github/workflows/`)
  - `ci.yml` — syntax + module load check on every branch push + `npm audit`
  - `deploy.yml` — CI must pass, then deploys to Vercel on `main`
- **Domain** — `moonnaturallyyours.com`
- See `docs/DEVOPS.md` for full Vercel setup, DNS records, GitHub Secrets list

### GitHub Secrets Required
| Secret | Value |
|---|---|
| `VERCEL_TOKEN` | From Vercel account settings |
| `VERCEL_ORG_ID` | From Vercel project settings |
| `VERCEL_PROJECT_ID` | From Vercel project settings |

### Vercel Environment Variables (set in Vercel dashboard)
All `backend/.env.example` variables plus `VITE_API_URL=/api`.

---

## Branch Strategy

```
main      ← production — Vercel auto-deploys on push here
staging   ← integration testing — merge here first, test, then PR to main
frontend  ← designer's active branch
```

- Frontend developer opens PRs into `staging`, not `main`
- Only merge `staging → main` when tested end-to-end

---

## Working Rules

- Backend-only changes: do not touch `frontend/` unless explicitly requested
- Frontend-only changes: do not touch `backend/` unless explicitly requested
- Do not duplicate business logic across controllers, services, repositories, and SQL
- Keep controllers thin: parse request → call service → send response
- Services are the only home for business rules
- Repositories are the only home for database access
- Validators are the only home for request shape validation
- Never hardcode secrets — all config flows through `backend/src/config/env.js` and Vercel env vars
- Run `npm audit --audit-level=high` after adding backend dependencies
- Update `docs/backend_context.md` whenever any backend or database file is added, removed, renamed, or materially repurposed
- Do not reintroduce a second UI implementation at repo root — `frontend/` is the live site

---

## Known Gaps

- `vercel.json` needs updating: output directory and build command must point to `frontend/` for production build
- Razorpay live keys not configured — currently using test mode
- `RESEND_API_KEY` needed for order confirmation emails to send
- Social links in footer still point to generic platform URLs — replace with actual brand handles
- OG cover image (`assets/og-cover.jpg`) and favicon files not yet created
- Legacy static site files (`index.html`, `css/`, `js/`) at repo root are superseded by `frontend/` — remove when React build is verified working in production
- Admin account must be seeded directly in Supabase (no API endpoint to create admin users)
