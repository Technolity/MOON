# MOON E-Commerce Platform - Developer Quick Start Guide

**For:** Development Team  
**Date:** April 2, 2026  
**Time to Read:** 10 minutes  
**Status:** 🟢 Ready to Execute  

---

## 🚀 Get Started in 5 Minutes

### 1. Clone & Install (5 minutes)
```bash
# Clone main repo
git clone https://github.com/yourusername/moon-ecommerce.git
cd moon-ecommerce

# Frontend
cd frontend
npm install
cp .env.example .env.local

# Backend (in new terminal)
cd ../backend
npm install
cp .env.example .env

# Database (go to Supabase dashboard)
# Run SQL migrations (see section below)
```

### 2. Environment Variables
**Frontend: `frontend/.env.local`**
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_1234567890
VITE_GA_ID=G-xxxxxxxxxx
VITE_ENV=development
```

**Backend: `backend/.env`**
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx

# Auth
JWT_SECRET=your-random-secret-key

# Razorpay
RAZORPAY_KEY=rzp_test_xxxxx
RAZORPAY_SECRET=xxxxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE=+1234567890

# SendGrid
SENDGRID_API_KEY=SG.xxxxx

# Email
EMAIL_FROM=noreply@moonbrand.com
```

### 3. Start Development
```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Opens http://localhost:3000

# Terminal 2: Backend
cd backend
npm run dev
# Server running on http://localhost:5000

# Terminal 3: Monitor database
# Go to Supabase Dashboard in browser
```

---

## 📋 Pre-Development Checklist

### Accounts to Create (Day 1)

- [ ] **GitHub** - [github.com](https://github.com)
  - Create organization or use personal
  - Create repositories: `moon-ecommerce`

- [ ] **Supabase** - [supabase.com](https://supabase.com)
  - Create new project (Singapore region for India)
  - Copy Project URL and Anon Key
  - Save to environment variables

- [ ] **Razorpay** - [razorpay.com](https://razorpay.com)
  - Sign up for Business account
  - Get Test Keys (KEY_ID and SECRET)
  - Save credentials

- [ ] **Twilio** - [twilio.com](https://twilio.com)
  - Sign up for account
  - Buy phone number (+1 US for testing)
  - Enable WhatsApp API
  - Get Account SID and Auth Token

- [ ] **SendGrid** - [sendgrid.com](https://sendgrid.com)
  - Sign up (free tier: 100 emails/day)
  - Create API key
  - Verify sender email (noreply@moonbrand.com)

- [ ] **Google Analytics 4** - [analytics.google.com](https://analytics.google.com)
  - Create property for website
  - Get Measurement ID (G-xxxxxxxxxx)

- [ ] **Vercel** - [vercel.com](https://vercel.com)
  - Sign up with GitHub
  - Connect repository for auto-deploy

- [ ] **Railway/Render** - [railway.app](https://railway.app) or [render.com](https://render.com)
  - Sign up with GitHub
  - Create new PostgreSQL database

### Development Tools to Install

```bash
# Global tools
npm install -g @vercel/cli
npm install -g @railway/cli
npm install -g nodemon
npm install -g vite

# Code quality
npm install -g eslint
npm install -g prettier
```

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Select **Singapore** region (closest to India)
4. Choose password strength: Strong
5. Wait 2-3 minutes for project creation

### Step 2: Copy Credentials
```
Project URL: https://xxxxx.supabase.co
Anon Key: xxxxx
```
Save these in both frontend and backend `.env` files.

### Step 3: Run Database Migrations
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste this entire SQL script:

```sql
-- ============================================
-- MOON DATABASE SCHEMA
-- ============================================

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'customer', -- customer, admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 2. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  image_url VARCHAR(500),
  category VARCHAR(100),
  theme VARCHAR(50), -- honey, saffron, shilajit, dates
  meta_title VARCHAR(255),
  meta_description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_slug ON products(slug);

-- 3. Inventory Table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0,
  reserved INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_product_id ON inventory(product_id);

-- 4. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, packed, shipped, delivered, cancelled
  subtotal DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(15),
  shipping_address_line1 TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_pincode VARCHAR(10),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 5. Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 6. Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_signature VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, captured, failed, refunded
  method VARCHAR(50), -- upi, card, netbanking, wallet
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);

-- 7. Shipping Zones Table
CREATE TABLE shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_name VARCHAR(100) NOT NULL,
  states TEXT[] NOT NULL, -- Array: ['Delhi', 'Punjab', 'Haryana']
  cost DECIMAL(10, 2) NOT NULL,
  estimated_days INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Analytics Events Table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(100) NOT NULL, -- page_view, cart_add, purchase, etc.
  product_id UUID REFERENCES products(id),
  properties JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Sample Products
INSERT INTO products (name, slug, description, price, image_url, category, theme, meta_title, meta_description)
VALUES
(
  'Kashmiri Saffron',
  'kashmiri-saffron',
  'Hand-picked Kashmiri Saffron from Pampore. Mongra A++ grade. Each strand is a testament to patience and purity.',
  850.00,
  'https://images.unsplash.com/photo-1599599810694-d0ec2827fca0?w=500',
  'Spices',
  'saffron',
  'Kashmiri Saffron | Premium Mongra A++ | MOON',
  'Buy authentic hand-picked Kashmiri Saffron online. 100% pure, Mongra A++ grade.'
),
(
  'Sidr Honey',
  'sidr-honey',
  'Pure Sidr Honey from Yemen. Harvested from sacred Lote trees. Raw, unfiltered, and packed with enzymes.',
  1500.00,
  'https://images.unsplash.com/photo-1599599810694-d0ec2827fca0?w=500',
  'Honey',
  'honey',
  'Sidr Honey | Premium Yemeni Honey | MOON',
  'Buy pure Sidr Honey from Yemen online. 100% organic, raw, and unfiltered.'
),
(
  'Pure Shilajit',
  'pure-shilajit',
  'Pure Himalayan Shilajit resin. Rich in fulvic acid and trace minerals. Boosts energy, immunity, and focus.',
  1999.00,
  'https://images.unsplash.com/photo-1599599810694-d0ec2827fca0?w=500',
  'Supplements',
  'shilajit',
  'Pure Shilajit | Himalayan Gold | MOON',
  'Buy authentic Pure Shilajit online. High-grade, tested for purity.'
),
(
  'Premium Dates',
  'premium-dates',
  'Premium Ajwa and Medjool dates from the finest date palms. Rich in nutrients and natural sweetness.',
  1200.00,
  'https://images.unsplash.com/photo-1599599810694-d0ec2827fca0?w=500',
  'Dates',
  'dates',
  'Premium Dates | Ajwa & Medjool | MOON',
  'Buy premium Ajwa and Medjool dates online. Fresh, organic, and naturally sweet.'
),
(
  'Traditional Kufas',
  'traditional-kufas',
  'Hand-knit traditional cotton Kufas. Perfect for storage and everyday use. Eco-friendly and durable.',
  499.00,
  'https://images.unsplash.com/photo-1599599810694-d0ec2827fca0?w=500',
  'Accessories',
  'kufas',
  'Traditional Kufas | Hand-Knit Cotton | MOON',
  'Buy traditional hand-knit cotton Kufas online. Eco-friendly storage solutions.'
),
(
  'The Sunnah Box',
  'sunnah-box',
  'Complete wellness bundle: Saffron, Honey, Shilajit, Dates, and Kufas. Everything you need in one box.',
  4500.00,
  'https://images.unsplash.com/photo-1599599810694-d0ec2827fca0?w=500',
  'Bundles',
  'sunnah',
  'The Sunnah Box | Complete Wellness Bundle | MOON',
  'Buy The Sunnah Box - complete wellness bundle with all premium products.'
);

-- Create inventory for each product
INSERT INTO inventory (product_id, quantity, sku)
SELECT id, 100, UPPER(SUBSTRING(slug, 1, 3)) || '-' || FLOOR(RANDOM() * 1000)
FROM products;

-- Sample Shipping Zones
INSERT INTO shipping_zones (zone_name, states, cost, estimated_days, is_active)
VALUES
('North India', ARRAY['Delhi', 'Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Uttarakhand'], 50, 2, true),
('South India', ARRAY['Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Kerala'], 60, 3, true),
('West India', ARRAY['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan'], 50, 2, true),
('East India', ARRAY['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'], 80, 4, true),
('Northeast India', ARRAY['Assam', 'Manipur', 'Mizoram', 'Tripura', 'Nagaland', 'Meghalaya'], 100, 5, true);

-- Create admin user for testing
-- Password: admin123 (bcrypt hash)
INSERT INTO users (email, phone, first_name, last_name, role, password_hash)
VALUES
('admin@moonbrand.com', '+919876543210', 'Admin', 'User', 'admin', '$2b$10$...');

-- ============================================
-- DONE! Database is ready.
-- ============================================
```

3. Click "Run" button
4. Wait for completion (should see ✅ all tables created)

### Step 4: Verify
1. Go to "Table Editor" in Supabase
2. You should see all 8 tables:
   - users ✓
   - products ✓ (with 6 sample products)
   - inventory ✓
   - orders ✓
   - order_items ✓
   - payments ✓
   - shipping_zones ✓ (with 5 zones)
   - analytics_events ✓

---

## 🔑 API Keys & Credentials Checklist

### Get These First (Day 1)

**Razorpay**
```
Key ID (Test):     rzp_test_1234567890
Secret (Test):     abcd1234efgh5678
Dashboard:         https://dashboard.razorpay.com
Test Cards:        4111 1111 1111 1111 (Visa)
```
→ Save to `backend/.env` as `RAZORPAY_KEY` and `RAZORPAY_SECRET`

**Twilio**
```
Account SID:       ACxxxxx
Auth Token:        xxxxx
Phone Number:      +1 123 456 7890
WhatsApp Number:   +1 123 456 7890 (same)
```
→ Save to `backend/.env`

**SendGrid**
```
API Key:           SG.xxxxx
Verified Sender:   noreply@moonbrand.com
```
→ Save to `backend/.env` as `SENDGRID_API_KEY`

**Google Analytics 4**
```
Measurement ID:    G-XXXXXXXXXX
Website:           moonbrand.com (or localhost:3000)
```
→ Save to `frontend/.env.local` as `VITE_GA_ID`

**Supabase**
```
Project URL:       https://xxxxx.supabase.co
Anon Key:          xxxxx
Database Password: (save securely)
```
→ Save to both `.env` files

---

## 💻 Local Development Workflow

### Daily Standup (Morning)
```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Start development servers
npm run dev

# In new terminal, monitor database
open https://supabase.com  # Check for migration alerts
```

### During Development
```bash
# Create feature branch
git checkout -b feat/product-listing

# Make changes
# Test locally

# Commit with meaningful message
git add .
git commit -m "feat: add product listing page"

# Push and create Pull Request
git push origin feat/product-listing

# Wait for code review and merge
```

### Testing Workflow
```bash
# Run tests
npm test

# Run linter
npm run lint

# Fix issues
npm run lint --fix

# Check code quality
npm run format
```

### Before Pushing
```bash
# 1. Make sure everything builds
npm run build

# 2. Run tests
npm test

# 3. Check for console errors
npm run dev  # Check console in browser

# 4. Test payment flow (manual)
# 5. Test notifications (check emails/SMS)
# 6. Test on mobile

# Then push
git push
```

---

## 🧪 Testing Credentials

### Razorpay Test Cards
```
Visa:           4111 1111 1111 1111
Mastercard:     5555 5555 5555 4444
Debit Card:     6011 1111 1111 1117
Expiry:         Any future date (e.g., 12/25)
CVV:            Any 3 digits (e.g., 123)
OTP:            123456 (or anything)
```

### Twilio Test Numbers
```
Test Phone:     +15005550006  (Always fails - test rejections)
Test Phone:     +15005550009  (Always succeeds - test success)
WhatsApp:       Use your own number for testing
```

### Test Emails
```
Recipient:      your-email@gmail.com (receive all test emails)
Sender:         noreply@moonbrand.com
Template:       Use SendGrid sandbox for testing first
```

---

## 📊 Important Folders & Files

```
moon-ecommerce/
│
├── frontend/
│   ├── src/
│   │   ├── components/        ← Reusable React components
│   │   ├── pages/             ← Page components (Home, Cart, Checkout)
│   │   ├── store/             ← Redux state management
│   │   ├── services/          ← API calls (api.js, productService.js)
│   │   ├── styles/            ← Tailwind CSS (global.css, tailwind config)
│   │   ├── utils/             ← Helper functions
│   │   └── App.jsx            ← Main app component
│   ├── public/                ← Static images, favicon
│   ├── .env.local             ← Environment variables (create from .env.example)
│   ├── vite.config.js         ← Vite configuration
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/            ← Express routes (products.js, orders.js, etc.)
│   │   ├── controllers/       ← Route handlers (business logic)
│   │   ├── middleware/        ← Auth, error handling
│   │   ├── services/          ← External integrations (Razorpay, Twilio, SendGrid)
│   │   ├── config/            ← Database connection (supabase.js)
│   │   ├── utils/             ← Helper functions
│   │   └── server.js          ← Express server setup
│   ├── migrations/            ← Database migrations
│   ├── .env                   ← Environment variables (create from .env.example)
│   └── package.json
│
├── docs/                      ← Project documentation
│   ├── PRD.md                 ← Product requirements
│   ├── TECHNICAL_GUIDE.md     ← Implementation guide
│   └── API_DOCS.md            ← API documentation
│
├── .gitignore
├── README.md
└── DEPLOYMENT.md              ← Deployment instructions
```

### Key Files to Edit Today

**Frontend:**
- `frontend/src/App.jsx` - Main component
- `frontend/src/pages/HomePage.jsx` - Home page
- `frontend/src/components/ProductCard.jsx` - Product display
- `frontend/.env.local` - Add credentials here

**Backend:**
- `backend/src/server.js` - Server setup
- `backend/src/routes/products.js` - Product endpoints
- `backend/.env` - Add credentials here

---

## 🔗 Useful Links & Resources

### Documentation
- [React Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Razorpay Integration](https://razorpay.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### APIs to Test
- Razorpay: [https://dashboard.razorpay.com/app/test/api](https://dashboard.razorpay.com/app/test/api)
- Supabase: [https://app.supabase.com](https://app.supabase.com)
- SendGrid: [https://app.sendgrid.com](https://app.sendgrid.com)
- Twilio: [https://www.twilio.com/console](https://www.twilio.com/console)

### Tools
- **Postman**: API testing - [postman.com](https://postman.com)
- **DBeaver**: Database management - [dbeaver.io](https://dbeaver.io)
- **VS Code**: Code editor - [code.visualstudio.com](https://code.visualstudio.com)
- **Insomnia**: REST client - [insomnia.rest](https://insomnia.rest)

---

## ⚠️ Common Issues & Fixes

### "Cannot find module '@supabase/supabase-js'"
```bash
# Solution: Install dependencies
npm install
```

### "Razorpay key is undefined"
```bash
# Solution: Check .env file
cat backend/.env
# Make sure RAZORPAY_KEY and RAZORPAY_SECRET are set
# Restart server: npm run dev
```

### "CORS error when calling API"
```bash
# Solution: Check backend CORS setup in server.js
# Make sure FRONTEND_URL is correct
# Restart backend server
```

### "Database connection refused"
```bash
# Solution: Check Supabase credentials
# Verify SUPABASE_URL and SUPABASE_KEY in .env
# Make sure Supabase project is active
```

### "Port 5000 already in use"
```bash
# Solution: Kill the process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### "npm install takes too long"
```bash
# Solution: Clear npm cache
npm cache clean --force
npm install

# Or use yarn instead
npm install -g yarn
yarn install
```

---

## 📞 Getting Help

### During Development
1. **Check documentation** in `/docs` folder
2. **Search GitHub issues** for similar problems
3. **Post in Slack** #dev-help channel
4. **Schedule pair programming** session

### Reporting Bugs
```
Create GitHub issue with:
- Title: Clear description
- Description: What were you doing?
- Expected: What should happen?
- Actual: What actually happened?
- Steps to reproduce:
  1. ...
  2. ...
- Logs: Console errors (paste full error)
- Environment: OS, Node version, browser
```

---

## ✅ Day 1 Checklist (Complete Before Day 2)

- [ ] All accounts created (GitHub, Supabase, Razorpay, etc.)
- [ ] Repository cloned locally
- [ ] Dependencies installed (`npm install` in both folders)
- [ ] Environment variables added (frontend & backend)
- [ ] Supabase database schema created
- [ ] Sample data inserted
- [ ] Frontend server starts (`npm run dev`)
- [ ] Backend server starts (`npm run dev`)
- [ ] Can access http://localhost:3000 in browser
- [ ] Can call backend API (test with Postman)
- [ ] Supabase tables visible in dashboard
- [ ] First commit pushed to GitHub
- [ ] Created feature branches for your tasks

---

## 🎯 First Week Goals

### By End of Day 1
- ✅ Environment setup complete
- ✅ All services connected
- ✅ First commits made

### By End of Day 2-3
- ✅ React components for product listing
- ✅ Backend product API working
- ✅ Database queries working

### By End of Day 4-5
- ✅ Shopping cart functional
- ✅ Checkout page started
- ✅ Payment form UI complete

### By End of Week 1
- ✅ Full checkout flow working (without payment)
- ✅ Admin dashboard basic structure
- ✅ All endpoints tested in Postman

---

## 🚀 Ready to Build!

**You're all set. Start with:**
```bash
# 1. Clone repo
git clone <repo-url>

# 2. Install everything
npm install

# 3. Add credentials to .env files

# 4. Start developing!
npm run dev
```

**Any questions? Open GitHub issue or ask in Slack.**

Happy coding! 🎉

---

**Last Updated:** April 2, 2026  
**Questions?** Contact the project lead or check the full PRD document.
