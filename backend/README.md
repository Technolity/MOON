# MOON Backend

This folder contains the backend scaffold for the MOON e-commerce platform.

## Current Scope

- Express app bootstrapping
- API route registration that matches the PRD contract
- Shared middleware, validation, and error handling
- Integration client wrappers for Supabase, Razorpay, SendGrid, and Twilio
- Database migrations and seed scripts in the root `database/` folder

The domain routes are intentionally scaffolded first. Only the health endpoint is live; the rest of the handlers return structured `501 Not Implemented` responses until the domain logic is built.

## Run Locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server URL:

```bash
http://localhost:5000
http://localhost:5000/api/health
```

## Folder Rules

- `src/modules/*/*.routes.js` owns HTTP endpoint wiring only.
- `src/modules/*/*.controller.js` translates HTTP requests and responses.
- `src/modules/*/*.service.js` owns business logic.
- `src/modules/*/*.repository.js` owns database access only.
- `src/modules/*/*.validator.js` owns request shape validation only.
- `src/integrations/**` owns third-party SDK setup only.
- `database/migrations/**` is the schema source of truth.
- `database/seeds/**` owns bootstrap data only.

For the complete ledger of why each backend file exists, read `../backend_context.md`.
