# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Frontend

The current storefront is a static HTML/CSS/JS site at the repo root.
**Planned migration to React/Next.js** — see `docs/SEO_Optimisation.md` for React SEO notes.

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Running the Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

Health endpoint: `http://localhost:5000/api/health`

The server will print warnings on startup if critical env vars are missing.
It will **exit immediately** if run with `NODE_ENV=production` and secrets are absent or insecure.

## Architecture

Three parallel tracks in this repo:

1. Static frontend at the repo root (migration to React/Next.js pending)
2. Fully implemented Node.js/Express backend under `backend/`
3. Postgres schema and seeds under `database/`

### Frontend

Pure vanilla HTML/CSS/JS. No framework or bundler yet.

#### JS Files
- **`js/storytelling.js`** — `StorytellingEngine`. Preloads 192 JPEG frames per product and animates them on the fullscreen canvas based on scroll position.
- **`js/products.js`** — reserved for future shared product data.
- **`js/app.js`** — main controller. Theme switching, product switching, in-memory cart, newsletter demo, calls `storytellingEngine.setProduct()`.

#### CSS Files
- **`css/style.css`** — layout, components, cart modal, theme variables.
- **`css/animations.css`** — keyframe animations.
- **`css/storytelling.css`** — fullscreen canvas positioning.

#### Frame Animation Folders (192 JPEGs each)
- `ezgif-2fae6b36993927b6-jpg/` → honey
- `moon2222/` → saffron
- `moon333/` → shilajit

#### SEO (static phase)
- `index.html` has full meta tags, Open Graph, Twitter Card, canonical URL, JSON-LD structured data (Organization, WebSite, ItemList with 3 Products).
- `robots.txt` and `sitemap.xml` are at repo root.
- See `docs/SEO_Optimisation.md` for the full checklist and React migration plan.

### Backend

All modules are **fully implemented** — no 501 stubs remain.

| Module | Endpoints | Notes |
|---|---|---|
| health | `GET /api/health` | Always live |
| auth | register, login, logout, refresh-token, me | bcryptjs + JWT (15 min access / 7 day refresh) |
| products | list, search, getById | Supabase queries, UUID or slug lookup |
| cart | get, add, update, remove, clear | JSONB-backed, user or guest (`x-session-id` header) |
| shipping | calculate, listZones | Zone match by state, free above ₹999 |
| orders | create, list, getById, updateStatus | DB prices enforced, inventory reserved on creation |
| payments | createRazorpayOrder, verify, getStatus | HMAC signature verification, auto-confirms order |
| notifications | sendEmail | Resend only — SMS/WhatsApp manual via community |
| inventory | list, update | Admin only |
| analytics | dashboard, orders, revenue, customers | Admin only, date-range filterable |

#### Integration clients
- **Supabase** — `backend/src/integrations/database/supabase-admin.js` (lazy, service role)
- **Razorpay** — `backend/src/integrations/payments/razorpay.client.js` (lazy)
- **Resend** — `backend/src/integrations/notifications/resend.client.js` (lazy) — email only
- **SendGrid** — tombstoned, returns null stub
- **Twilio** — file present but unused; SMS/WhatsApp handled manually

### Database

Migrations run in order via Supabase SQL Editor:

| File | What it creates |
|---|---|
| `0001_extensions.sql` | `pgcrypto`, `citext` |
| `0002_core_schema.sql` | All tables, enums, indexes |
| `0003_updated_at_triggers.sql` | `updated_at` auto-trigger on all tables |
| `0004_carts.sql` | `carts` table (user + guest session) |
| `0005_inventory_rpc.sql` | `increment_reserved()` Postgres function |
| `seeds/0001_products.sql` | 3 products + inventory rows |
| `seeds/0002_shipping_zones.sql` | India shipping zones |

## Security

- `env.js` validates all critical secrets at startup — exits in production if missing or insecure
- JWT access tokens expire in 15 minutes; refresh tokens in 7 days
- Three rate limit tiers: general API (100/15 min), auth (10/15 min), payments (20/5 min)
- Helmet with explicit CSP, HSTS (1 year, preload), referrer policy
- CORS blocks no-origin requests in production
- Body size capped at 100kb
- Error handler never leaks internal messages in production
- `trust proxy 1` set for accurate IP rate-limiting behind Railway/Vercel

## DevOps

- **Frontend** → Vercel (free), auto-deploy on push to `main`
- **Backend** → Railway Hobby ($5/month, no cold starts), auto-deploy on push to `main`
- **CI/CD** → GitHub Actions (`.github/workflows/`)
  - `ci.yml` — syntax + module load check on every branch push
  - `deploy.yml` — CI must pass, then deploys both platforms on `main`
- Domain: `moonnaturallyyours.com`
- See `docs/DEVOPS.md` for full setup steps (Railway, Vercel, DNS, GitHub Secrets)

## Working Rules

- If the task is backend-only, do not change frontend files unless explicitly requested.
- Do not duplicate business logic across controllers, services, repositories, and SQL.
- Update `docs/backend_context.md` whenever any backend or database file is added, removed, renamed, or materially repurposed.
- Keep controllers thin: parse request, call service, send response.
- Services are the only home for business rules.
- Repositories are the only home for database access.
- Validators are the only home for request shape validation.
- Never hardcode secrets — all config flows through `backend/src/config/env.js`.
- Run `npm audit --audit-level=high` after adding dependencies.

## Known Gaps

- Frontend checkout, cart, newsletter, and payment flow are still demo-only — not yet wired to the backend APIs.
- Frontend migration to React/Next.js not started — current site is static HTML.
- Razorpay live keys not configured — currently using test mode.
- `RESEND_API_KEY` needed for order confirmation emails to send.
- Social links in `index.html` footer still point to generic platform URLs — replace with actual brand handles.
- OG cover image (`assets/og-cover.jpg`) and favicon files not yet created.
