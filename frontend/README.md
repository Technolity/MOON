# MOON Frontend

React + TypeScript frontend built from `MOON_eCommerce_PRD_v1.md` with owner-only admin dashboard layouts and cinematic storefront UI.

## Stack

- React 18
- TypeScript
- Redux Toolkit (+ RTK Query scaffold)
- Tailwind CSS (configured)
- Vite

## Run Frontend Only

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Dev URL: `http://localhost:3000`

## Build

```bash
cd frontend
npm run build
```

## Routes

- `/` - cinematic landing + product discovery
- `/cart` - dedicated cart page
- `/checkout` - dedicated shipping and payment page
- `/admin/login` - owner login for dashboard access
- `/admin/dashboard-overview` - dashboard overview layout
- `/admin/inventory` - inventory layout
- `/admin/analytics-focus` - analytics focus layout

## Admin Access

Admin routes are owner-only and guarded in the frontend session layer.

- `VITE_ADMIN_OWNER_EMAIL`
- `VITE_ADMIN_OWNER_PASSWORD`
- `VITE_ADMIN_OWNER_NAME`

## Structure

- `src/App.tsx` - app shell, routing, admin gating, cart drawer wiring
- `src/components` - shared shell components (`Navbar`, `Footer`, `CartDrawer`)
- `src/pages/HomePage.tsx` - primary storefront page
- `src/pages/admin` - admin dashboard layouts (`dashboard-overview`, `inventory`, `analytics-focus`)
- `src/store` - Redux cart slice + RTK Query setup
- `src/hooks/useStorytellingCanvas.ts` - scroll-driven hero canvas animation
- `src/data/products.ts` - product, catalog, shipping zone data
- `src/styles` - global styles + route styles + animation helpers
- `public` - product frame image folders used by storytelling canvas

## Assets

The frame assets are stored directly under `frontend/public`:

- `public/moon2222`
- `public/moon333`
- `public/ezgif-2fae6b36993927b6-jpg`
