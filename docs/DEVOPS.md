# DevOps Setup Guide — MOON

## Stack

| Layer | Platform | Cost |
|---|---|---|
| Frontend | Vercel | Free |
| Backend | Railway | $5/month (Hobby — no cold starts) |
| Database | Supabase | Free |
| CI/CD | GitHub Actions | Free (2000 min/month) |
| Domain | moonnaturallyyours.com | Already purchased |

---

## How it works

```
git push → main branch
         ↓
GitHub Actions CI (syntax check + module load + audit)
         ↓ only if CI passes
    ┌────┴────┐
    ↓         ↓
Railway     Vercel
(backend)  (frontend)
    ↓         ↓
 /api/health checked    site live at moonnaturallyyours.com
```

Every push to `main` triggers the pipeline. Bad code never reaches production
because CI runs before the deploy step. If CI fails, nothing deploys.

---

## One-time setup steps

### Step 1 — Railway

1. Go to **railway.app** → sign up with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your MOON repo
4. Set **Root Directory** to `backend`
5. Railway will detect `railway.toml` automatically
6. Go to **Settings → Variables** and add every key from `backend/.env.example`:
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://moonnaturallyyours.com
   JWT_SECRET=<generate a 64-char random string>
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   RAZORPAY_KEY=rzp_live_xxx
   RAZORPAY_SECRET=xxx
   RESEND_API_KEY=re_xxx
   EMAIL_FROM=orders@moonnaturallyyours.com
   ```
7. Go to **Settings → Networking** → generate a public domain
8. Under **Deploy → Triggers**: set to **Manual** (GitHub Actions will trigger it)
9. Go to your Railway project **Settings → Tokens** → create a token → copy it

### Step 2 — Vercel

1. Go to **vercel.com** → sign up with GitHub
2. Click **Add New Project** → import your MOON repo
3. Set **Root Directory** to `.` (repo root, not backend)
4. Framework preset: **Other** (static for now, Next.js later)
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-domain.up.railway.app
   ```
6. Deploy once manually → go to **Settings → Domains** → add `moonnaturallyyours.com`
7. Go to **Settings → General** → find your **Project ID** and **Team/Org ID** → copy both
8. Go to **Settings → Tokens** → create a token → copy it

### Step 3 — GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions**:

**Add these Secrets** (encrypted, never visible after saving):
| Secret name | Value |
|---|---|
| `RAILWAY_TOKEN` | Token from Railway step 9 |
| `VERCEL_TOKEN` | Token from Vercel step 8 |
| `VERCEL_ORG_ID` | Org/Team ID from Vercel step 7 |
| `VERCEL_PROJECT_ID` | Project ID from Vercel step 7 |

**Add this Variable** (visible, not secret):
| Variable name | Value |
|---|---|
| `RAILWAY_SERVICE_NAME` | Name of your service in Railway (e.g. `moon-backend`) |

### Step 4 — Domain DNS

In your domain registrar (wherever you bought `moonnaturallyyours.com`):

**For the frontend (Vercel):**
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

**For the backend API subdomain:**
```
Type    Name    Value
CNAME   api     your-railway-domain.up.railway.app
```

This makes:
- `moonnaturallyyours.com` → frontend
- `api.moonnaturallyyours.com` → backend

Then update `FRONTEND_URL` in Railway to `https://moonnaturallyyours.com`
and update `vercel.json` API proxy to `https://api.moonnaturallyyours.com`.

### Step 5 — Test the pipeline

```bash
git checkout main
git merge backend-integration
git push origin main
```

Go to your GitHub repo → **Actions** tab — you should see the workflow running.
It will:
1. Run CI checks (~1 min)
2. Deploy backend to Railway (~2 min)
3. Deploy frontend to Vercel (~1 min)

Check Railway logs for the health check passing:
```
GET /api/health → 200 OK
```

---

## Daily workflow (once set up)

```bash
# Work on a feature
git checkout backend-integration
# ... make changes ...
git add .
git commit -m "feat: add order webhook"
git push

# CI runs automatically — checks syntax on this branch

# When ready to go live
git checkout main
git merge backend-integration
git push origin main

# GitHub Actions automatically:
# → checks code
# → deploys backend to Railway
# → deploys frontend to Vercel
# → moonnaturallyyours.com updates in ~3 minutes
```

---

## Health monitoring

Railway has built-in health checks via `healthcheckPath = "/api/health"` in `railway.toml`.

If the backend crashes:
- Railway restarts it automatically (up to 3 times)
- You get an email notification from Railway

To add crash alerts to a specific email:
- Railway Dashboard → Project → Settings → Notifications → Add email

---

## Switching platforms (if needed)

### If you want to move from Railway to Fly.io (free, no cold starts):
1. Install Fly CLI: `npm install -g flyctl`
2. In `backend/`: run `fly launch` → follow prompts
3. Replace the Railway deploy step in `deploy.yml` with:
   ```yaml
   - name: Deploy to Fly.io
     run: fly deploy --app moon-backend
     env:
       FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
   ```
4. Set secrets in Fly: `fly secrets set JWT_SECRET=xxx SUPABASE_URL=xxx ...`

### If you want to move from Railway to Koyeb (free, no cold starts):
Similar process — Koyeb has a GitHub Actions integration and auto-deploys from GitHub.

---

## Environment variables checklist (production)

Before going live, verify all of these are set in Railway:

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` (64+ random characters)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `RAZORPAY_KEY` (use live key, not test key)
- [ ] `RAZORPAY_SECRET`
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM=orders@moonnaturallyyours.com`
- [ ] `FRONTEND_URL=https://moonnaturallyyours.com`
