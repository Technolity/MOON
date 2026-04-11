# MOON E-Commerce Platform - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** April 2, 2026  
**Project Lead:** [Your Name]  
**Target Launch:** 2-3 weeks (MVP Phase 1)

---

## Executive Summary

MOON is a premium e-commerce platform specializing in Prophetic wellness products (Saffron, Honey, Shilajit, Dates, etc.) targeting the India/South Asia market. The platform will launch as a B2C direct-to-consumer model with an MVP focused on core shopping experience, Razorpay payment integration, and India-wide shipping capabilities.

**Key Metrics:**
- Launch Timeline: 2-3 weeks
- Initial Product Count: 6 SKUs
- Target Market: India/South Asia
- Currency: INR (₹)
- Expected Volume: 100-500 orders/month (startup phase)

---

## 1. Product Vision & Goals

### 1.1 Vision Statement
Deliver an intuitive, beautifully designed e-commerce experience that showcases premium wellness products with seamless checkout and reliable shipping across India.

### 1.2 Primary Objectives (MVP Phase 1 - Weeks 1-3)
1. ✅ Launch fully functional landing page with product showcase (already built in HTML)
2. ✅ Implement React-based modular frontend for scalability
3. ✅ Build Node.js backend with REST API
4. ✅ Integrate Razorpay for payment processing
5. ✅ Set up Supabase for database (PostgreSQL)
6. ✅ Implement basic inventory management
7. ✅ Multi-zone shipping calculation
8. ✅ SMS + Email + WhatsApp notifications
9. ✅ Full event tracking & analytics
10. ✅ SEO optimization

### 1.3 Success Criteria
- Website loads < 3 seconds (Core Web Vitals: LCP < 2.5s)
- 99% payment success rate
- Zero cart abandonment due to technical issues
- All 6 products purchasable end-to-end
- Email + SMS delivered for all orders
- Zero critical bugs in production

---

## 2. Target Users & Use Cases

### 2.1 Primary Users
**Health-conscious consumers in India/South Asia**
- Age: 25-55 years
- Income: Middle to upper-middle class
- Interest: Organic, natural wellness products
- Behavior: Research-driven, quality-conscious

### 2.2 User Journeys

#### Journey 1: Browse & Purchase
```
1. Land on homepage → See animated product hero
2. Browse products via pill navigation or shop section
3. Read product details & health benefits
4. Add to cart → Checkout
5. Enter shipping details
6. Pay via Razorpay (UPI, Cards, Net Banking)
7. Receive order confirmation (Email + SMS + WhatsApp)
```

#### Journey 2: Customer Service
```
1. Order placed
2. Receive order confirmation + tracking info
3. Product ships within 2 days
4. Receive shipping updates via SMS
5. Delivery confirmation + WhatsApp message
```

#### Journey 3: Admin Order Management
```
1. New order notification in admin dashboard
2. View order details & customer info
3. Mark as packed/shipped
4. Inventory auto-updates
5. Generate shipping labels
6. View analytics dashboard
```

---

## 3. Feature Set & Requirements

### 3.1 MVP Phase 1 Features (Weeks 1-3)

#### Frontend (React)
- ✅ Landing page with hero animations (convert HTML to React components)
- ✅ Product carousel/navigation
- ✅ Product detail pages
- ✅ Shopping cart (localStorage + Redux)
- ✅ Checkout flow (guest + registered users)
- ✅ Order confirmation page
- ✅ Responsive design (mobile-first)
- ✅ Theme switching (Honey/Saffron/Shilajit color schemes)

#### Backend (Node.js)
- ✅ User management (auth with JWT)
- ✅ Product management API
- ✅ Cart management
- ✅ Order creation & management
- ✅ Razorpay payment integration
- ✅ Shipping zone calculation
- ✅ Inventory tracking
- ✅ Email service integration (Nodemailer)
- ✅ SMS service integration (Twilio or AWS SNS)
- ✅ WhatsApp integration (Twilio)
- ✅ Analytics event tracking

#### Database (Supabase/PostgreSQL)
- ✅ Users table
- ✅ Products table (6 initial SKUs)
- ✅ Orders table
- ✅ Order items table
- ✅ Inventory table
- ✅ Shipping zones table
- ✅ Analytics events table

#### Admin Dashboard (Phase 1.5)
- ✅ Order management (view, filter, update status)
- ✅ Inventory management
- ✅ Dashboard analytics (orders, revenue, customers)
- ✅ Email management (resend confirmations)

#### Payments
- ✅ Razorpay integration
- ✅ Support for: UPI, Cards (Debit/Credit), Net Banking, Wallets

#### Notifications
- ✅ Email: Order confirmation, shipping update, delivery confirmation
- ✅ SMS: Order placed, shipped, delivered
- ✅ WhatsApp: Order confirmation, shipping tracking link

#### SEO
- ✅ Meta tags for all pages
- ✅ Structured data (JSON-LD) for products
- ✅ Sitemap generation
- ✅ robots.txt
- ✅ Open Graph tags for social sharing
- ✅ Mobile-friendly (100/100 Google PageSpeed)

#### Analytics
- ✅ Google Analytics 4 setup
- ✅ Conversion tracking (cart adds, purchases)
- ✅ User behavior heatmaps (Hotjar or Smartlook)
- ✅ Event tracking (page views, clicks, form submissions)
- ✅ Funnel analysis (landing → cart → checkout → payment)

### 3.2 Post-Launch Features (Phase 2)
- User accounts & order history
- Product reviews & ratings
- Wishlist functionality
- Email newsletter signup
- Referral program
- Loyalty points system
- Product recommendations (AI-based)
- Live chat support
- Advanced inventory (stock alerts, backorder management)

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + TypeScript | Modern, scalable, component-based |
| **State Management** | Redux Toolkit + RTK Query | Centralized state, API caching |
| **Styling** | Tailwind CSS + CSS Modules | Fast development, maintainable |
| **Backend** | Node.js (Express.js) | JavaScript fullstack, fast setup |
| **Database** | Supabase (PostgreSQL) | Managed, real-time, built-in auth |
| **Payment** | Razorpay | India-first, UPI support, no setup fees |
| **SMS** | Twilio or AWS SNS | Reliable, good India coverage |
| **Email** | SendGrid or Nodemailer | Transactional email, high deliverability |
| **WhatsApp** | Twilio WhatsApp API | Native integration, customer preference |
| **Hosting** | Vercel (Frontend) + Railway/Render (Backend) | Auto-deploy, free tier, good performance |
| **Analytics** | Google Analytics 4 + Hotjar | Standard, free, comprehensive |
| **CDN** | Vercel Edge / Cloudflare | Image optimization, fast delivery |

### 4.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│          (React App on Vercel CDN)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──┐  ┌──────▼──┐  ┌──────▼──┐
│Google    │  │Hotjar   │  │Razorpay │
│Analytics │  │Heatmaps │  │Payment  │
└──────────┘  └─────────┘  └──────────┘
        │            │            │
        └────────────┼────────────┘
                     │ HTTPS
        ┌────────────▼────────────┐
        │   Node.js API Server    │
        │  (Railway/Render)       │
        │                         │
        │ ┌─────────────────────┐ │
        │ │ Express.js Routes   │ │
        │ │ - Users             │ │
        │ │ - Products          │ │
        │ │ - Orders            │ │
        │ │ - Payments          │ │
        │ │ - Analytics         │ │
        │ └─────────────────────┘ │
        │                         │
        │ ┌─────────────────────┐ │
        │ │ Service Layer       │ │
        │ │ - Razorpay Client   │ │
        │ │ - Email Service     │ │
        │ │ - SMS Service       │ │
        │ │ - WhatsApp Service  │ │
        │ └─────────────────────┘ │
        └────────────┬────────────┘
                     │
        ┌────────────┼────────────────────────┐
        │            │                        │
    ┌───▼──┐    ┌────▼────┐    ┌──────▼─────┐
    │Twilio│    │Supabase │    │SendGrid    │
    │(SMS) │    │(Database)    │(Email)    │
    └──────┘    └─────────┘    └────────────┘
                     │
            ┌────────▼────────┐
            │  PostgreSQL DB  │
            │  Tables:        │
            │  - users        │
            │  - products     │
            │  - orders       │
            │  - items        │
            │  - inventory    │
            │  - zones        │
            │  - analytics    │
            └─────────────────┘
```

### 4.3 API Endpoints (Node.js Backend)

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me
```

#### Products
```
GET    /api/products              (all products)
GET    /api/products/:id          (single product)
GET    /api/products/search?q=... (search)
```

#### Cart
```
GET    /api/cart                  (get cart)
POST   /api/cart/add              (add item)
PUT    /api/cart/update/:itemId   (update quantity)
DELETE /api/cart/remove/:itemId   (remove item)
POST   /api/cart/clear            (clear cart)
```

#### Orders
```
POST   /api/orders                (create order)
GET    /api/orders/:id            (get order details)
GET    /api/orders                (list user orders)
PUT    /api/orders/:id/status     (admin: update status)
```

#### Payments
```
POST   /api/payments/razorpay     (initiate payment)
POST   /api/payments/verify       (verify payment)
GET    /api/payments/:orderId     (payment status)
```

#### Shipping
```
POST   /api/shipping/calculate    (calculate shipping cost)
GET    /api/shipping/zones        (get shipping zones)
```

#### Notifications
```
POST   /api/notifications/email   (send email)
POST   /api/notifications/sms     (send SMS)
POST   /api/notifications/whatsapp (send WhatsApp)
```

#### Admin Analytics
```
GET    /api/admin/analytics/dashboard
GET    /api/admin/analytics/orders
GET    /api/admin/analytics/revenue
GET    /api/admin/analytics/customers
```

#### Inventory
```
GET    /api/inventory             (all products stock)
PUT    /api/inventory/:id         (admin: update stock)
```

---

## 5. Database Schema (Supabase)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  image_url VARCHAR(500),
  category VARCHAR(100),
  theme VARCHAR(50), -- 'honey', 'saffron', 'shilajit', etc.
  meta_title VARCHAR(255),
  meta_description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Inventory Table
```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 0,
  reserved INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, packed, shipped, delivered, cancelled
  subtotal DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2),
  shipping_address_id UUID,
  billing_address_id UUID,
  payment_id UUID,
  tracking_number VARCHAR(100),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(15),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT,
  unit_price DECIMAL(10, 2),
  subtotal DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending', -- pending, authorized, captured, failed, refunded
  method VARCHAR(50), -- upi, card, netbanking, wallet
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Shipping Zones Table
```sql
CREATE TABLE shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_name VARCHAR(100),
  states TEXT[], -- array of Indian states
  cost DECIMAL(10, 2),
  estimated_days INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analytics Events Table
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(100), -- page_view, cart_add, checkout_start, purchase, etc.
  product_id UUID REFERENCES products(id),
  properties JSONB, -- flexible data structure
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_event_type (event_type)
);
```

---

## 6. Shipping Strategy

### 6.1 Shipping Zones (India)

| Zone | States | Cost | Days |
|------|--------|------|------|
| **North** | Delhi, Punjab, Haryana, Himachal, J&K | ₹50 | 2-3 |
| **South** | Karnataka, Tamil Nadu, Telangana, Andhra | ₹60 | 3-4 |
| **West** | Maharashtra, Gujarat, Goa, Rajasthan | ₹50 | 2-3 |
| **East** | West Bengal, Odisha, Bihar, Jharkhand | ₹80 | 4-5 |
| **Northeast** | Assam, Manipur, Mizoram, Tripura, etc. | ₹100 | 5-7 |

### 6.2 Shipping Flow
1. User selects shipping address
2. System calculates zone based on pincode/state
3. Shipping cost displayed before checkout
4. Razorpay payment includes shipping
5. Order created with shipping details
6. Admin generates shipping label (integration with Shiprocket or ShipYaRa)
7. SMS/WhatsApp sent with tracking link
8. Delivery confirmation triggers final notification

---

## 7. Payment Integration (Razorpay)

### 7.1 Payment Flow

```
User Checkout
    ↓
Create Order (Backend)
    ↓
Generate Razorpay Order ID
    ↓
Display Razorpay Checkout Modal
    ↓
User Enters Payment Details
    ↓
Razorpay Processes Payment
    ↓
Webhook Notification to Backend
    ↓
Verify Payment Signature
    ↓
Create Order in Database
    ↓
Send Confirmations (Email, SMS, WhatsApp)
```

### 7.2 Razorpay Configuration
- **Account Type:** Razorpay Business
- **Supported Methods:** UPI, Cards, Net Banking, Wallets
- **Fees:** ~2% + ₹0-3 per transaction (India)
- **Settlement:** T+1 to bank account
- **Webhook Events:** payment.authorized, payment.failed, payment.captured

### 7.3 Implementation
```javascript
// Backend: Create Razorpay Order
const razorpayOrder = await razorpay.orders.create({
  amount: totalAmount * 100, // in paise
  currency: 'INR',
  receipt: orderId,
  notes: {
    customerId: userId,
    productIds: cartItems.map(i => i.id)
  }
});

// Frontend: Trigger Razorpay Checkout
const options = {
  key: process.env.REACT_APP_RAZORPAY_KEY,
  order_id: razorpayOrderId,
  handler: handlePaymentSuccess,
  prefill: {
    email: userEmail,
    contact: userPhone
  }
};
window.Razorpay(options).open();

// Backend: Verify Payment
const crypto = require('crypto');
const hash = crypto
  .createHmac('sha256', razorpaySecret)
  .update(paymentId + '|' + orderId)
  .digest('hex');

if (hash === signature) {
  // Payment verified
}
```

---

## 8. Notification Strategy

### 8.1 Email Notifications (SendGrid)
```
1. Order Confirmation
   - Order number, total, items
   - Estimated delivery date
   - Invoice PDF attachment

2. Shipping Notification
   - Tracking number & link
   - Carrier info
   - Expected delivery

3. Delivery Confirmation
   - Confirmation of delivery
   - Thank you message
   - Review request
```

### 8.2 SMS Notifications (Twilio)
```
1. Order Placed: "Order #12345 confirmed. You'll receive updates soon. -MOON"
2. Shipped: "Your order shipped! Track: [link]. Arrives in 2-3 days. -MOON"
3. Delivered: "Delivered! Enjoy your MOON wellness products. -MOON"
```

### 8.3 WhatsApp Notifications (Twilio API)
```
1. Order Confirmation with order summary
2. Shipping tracking link with carrier info
3. Delivery notification with thank you message
4. Review request card after delivery
```

### 8.4 Implementation
```javascript
// Email Service
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: customerEmail,
  from: 'orders@moonbrand.com',
  templateId: 'd-ordernumber-template-id',
  dynamicTemplateData: { orderData }
});

// SMS Service
const twilio = require('twilio')(accountSid, authToken);
await twilio.messages.create({
  body: 'Order #12345 confirmed...',
  from: '+1234567890', // Twilio number
  to: customerPhone
});

// WhatsApp Service
await twilio.messages.create({
  from: 'whatsapp:+1234567890',
  to: `whatsapp:${customerPhone}`,
  body: 'Your order has been confirmed!'
});
```

---

## 9. Analytics & Tracking

### 9.1 Google Analytics 4 Events
```
page_view          → Every page load
view_item_list     → Product listing page
view_item          → Product detail page
add_to_cart        → Item added to cart
remove_from_cart   → Item removed from cart
view_cart          → Cart page visited
begin_checkout     → Checkout started
add_shipping_info  → Shipping address entered
add_payment_info   → Payment form displayed
purchase           → Order completed
```

### 9.2 Custom Event Tracking
```javascript
// Track custom events
const trackEvent = (eventName, data) => {
  window.gtag('event', eventName, {
    'event_category': 'ecommerce',
    'event_label': data.product_id,
    'value': data.value,
    ...data
  });
};

// Track purchase
trackEvent('purchase', {
  product_id: productId,
  quantity: qty,
  value: totalPrice
});
```

### 9.3 Heatmaps (Hotjar)
- User scroll behavior
- Click tracking
- Form field abandonment
- Session recordings

### 9.4 Admin Dashboard Metrics
```
- Total Orders (Today, Week, Month)
- Revenue (Daily, Weekly, Monthly)
- Average Order Value
- Customer Acquisition Cost (CAC)
- Conversion Rate (Visitors → Customers)
- Top Products by Revenue
- Top States by Orders
- Payment Method Distribution
- Shipping Zone Distribution
- Cart Abandonment Rate
```

---

## 10. SEO Strategy

### 10.1 On-Page SEO
```javascript
// Product Page Meta Tags
<head>
  <title>Kashmiri Saffron | Premium Mongra A++ | MOON</title>
  <meta name="description" content="Hand-picked Kashmiri Saffron, Mongra A++ grade. 100% organic, pure saffron for health & cooking...">
  <meta name="keywords" content="saffron, kashmiri saffron, mongra saffron, organic saffron">
  
  <!-- Open Graph for Social Sharing -->
  <meta property="og:title" content="Kashmiri Saffron | Premium Mongra A++">
  <meta property="og:description" content="...">
  <meta property="og:image" content="saffron-image-url">
  <meta property="og:url" content="https://moonbrand.com/products/saffron">
  
  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Kashmiri Saffron",
    "image": "image-url",
    "description": "...",
    "brand": { "@type": "Brand", "name": "MOON" },
    "offers": {
      "@type": "Offer",
      "price": "850",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24"
    }
  }
  </script>
</head>
```

### 10.2 Technical SEO
- ✅ Mobile-responsive design (100/100 PageSpeed)
- ✅ Fast loading (< 3 seconds LCP)
- ✅ Clean URL structure: `/products/saffron` not `/products?id=123`
- ✅ XML Sitemap: `/sitemap.xml` updated daily
- ✅ robots.txt: Allow crawlers, disallow admin routes
- ✅ Canonical tags: Prevent duplicate content
- ✅ Internal linking: Related products, category navigation
- ✅ Image optimization: WebP format, responsive srcset

### 10.3 Content SEO
- Product descriptions: 150-200 words, keyword-rich
- Blog/Health Benefits section: Long-form content (1000+ words)
- Schema markup: Products, Organization, FAQs
- Keyword targeting: "Kashmiri saffron", "sidr honey India", "shilajit benefits"

---

## 11. Development Timeline (2-3 Weeks)

### Week 1: Foundation
**Days 1-2: Setup & Architecture**
- Set up Git repository
- Initialize React project (Vite recommended for speed)
- Initialize Node.js backend (Express)
- Configure Supabase database
- Set up environment variables

**Days 3-5: Frontend - Core Components**
- Convert HTML to React components
- Build product catalog pages
- Implement shopping cart (Redux)
- Build checkout form
- Responsive mobile design

**Days 3-5: Backend - API Setup**
- Express server setup
- Supabase database connection
- User authentication (JWT)
- Product CRUD APIs
- Cart management APIs

### Week 2: Payments & Shipping
**Days 6-8: Payment Integration**
- Razorpay integration (frontend + backend)
- Payment verification & webhooks
- Order creation flow
- Error handling & retries

**Days 6-8: Shipping & Notifications**
- Shipping zone logic
- SMS/Email/WhatsApp integration
- Notification templates
- Testing notifications

**Days 9-10: Admin Dashboard**
- Order management interface
- Inventory management
- Basic analytics dashboard
- Email resend functionality

### Week 3: Polish & Launch
**Days 11-12: SEO & Analytics**
- Google Analytics 4 setup
- Meta tags & structured data
- Sitemap & robots.txt
- Hotjar integration

**Days 13-15: Testing & Deployment**
- End-to-end testing (payment flow)
- Mobile testing
- Performance testing
- Bug fixes
- Deploy to Vercel (frontend) + Railway (backend)
- Go live!

### Critical Path
```
Day 1-2:   Setup
Day 3-5:   Frontend + Backend foundation
Day 6-10:  Payments, Shipping, Admin
Day 11-12: SEO, Analytics
Day 13-15: Testing, Deployment, Launch
```

---

## 12. Deployment & Hosting

### 12.1 Frontend Hosting (Vercel)
```bash
# Deployment
npm install -g vercel
vercel deploy

# Auto-deploys on git push
# Includes:
# - CDN for global distribution
# - Edge function support
# - Built-in CI/CD
# - Analytics
```

### 12.2 Backend Hosting (Railway or Render)

**Option A: Railway (Recommended)**
- Pricing: Pay-as-you-go, ₹3000-5000/month for MVP
- Setup: Connect GitHub, auto-deploy
- Includes: PostgreSQL, Redis, environment variables
- PostgreSQL: Railway Supabase integration

**Option B: Render**
- Free tier available
- Auto-deploy from GitHub
- PostgreSQL: Render PostgreSQL
- SSL certificates included

### 12.3 Database (Supabase)
```
- Pricing: Free tier (500 MB, 2GB bandwidth)
- Later: Pro tier (₹3000/month)
- Auto-backups
- Real-time capabilities
- Built-in authentication
```

### 12.4 Environment Variables
```
# Frontend (.env.local)
REACT_APP_API_URL=https://api.moonbrand.com
REACT_APP_RAZORPAY_KEY=rzp_live_xxxxx
REACT_APP_GA_ID=G-xxxxx

# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
RAZORPAY_KEY=rzp_live_xxxxx
RAZORPAY_SECRET=secret
SENDGRID_API_KEY=SG.xxxxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
GOOGLE_ANALYTICS_ID=G-xxxxx
```

---

## 13. Security & Compliance

### 13.1 Security Best Practices
- ✅ HTTPS/TLS for all connections
- ✅ JWT tokens for authentication (HttpOnly cookies preferred)
- ✅ Password hashing (bcrypt, salt rounds: 10)
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (Content Security Policy headers)
- ✅ CSRF tokens for state-changing requests
- ✅ Rate limiting on APIs (prevent brute force)
- ✅ Secure payment handling (PCI DSS via Razorpay)

### 13.2 Compliance
- ✅ Privacy Policy (GDPR, CCPA ready)
- ✅ Terms of Service
- ✅ Refund Policy
- ✅ Data Protection (store minimal PII)
- ✅ Razorpay: Compliant with Indian regulations

### 13.3 Code Example: Security Headers
```javascript
// Express middleware
const helmet = require('helmet');
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

---

## 14. Risk Assessment & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Payment gateway delays | Medium | High | Use Razorpay test mode, webhook monitoring |
| High cart abandonment | Medium | High | Clear checkout UI, guest checkout, saved cards |
| Shipping delays | Medium | High | Partner with reliable courier (Shiprocket) |
| Database downtime | Low | Critical | Supabase auto-backup, monitoring alerts |
| Order data loss | Low | Critical | Daily backups, transaction logs |
| Security breach | Low | Critical | SSL, WAF, regular security audits |
| Slow performance | Medium | Medium | CDN, image optimization, lazy loading |
| SMS delivery failures | Low | Medium | Redundant SMS providers (Twilio + AWS) |

---

## 15. Success Metrics & KPIs

### 15.1 Business Metrics
```
Launch Week (Week 1):
- 10-20 test orders
- 99%+ payment success rate
- <1% checkout abandonment rate
- All notifications delivered

Month 1:
- 30-50 orders
- ₹25,000-40,000 GMV
- 2-3% conversion rate
- <5% refund rate

Month 2-3:
- 100-150 orders/month
- 3-5% conversion rate
- ₹50,000+ monthly revenue
```

### 15.2 Technical Metrics
```
- Page Load Time: <3 seconds (LCP <2.5s)
- Mobile Score: >90 (Google PageSpeed)
- Uptime: >99.5%
- API Response Time: <200ms
- Database Query Time: <50ms
- Checkout Conversion Rate: >3%
```

### 15.3 User Metrics
```
- Cart Abandonment Rate: <70%
- Average Order Value: ₹1500-2000
- Customer Acquisition Cost: <₹300
- Return Customer Rate: 15%+ (Phase 2)
- Email Open Rate: >25%
- SMS Open Rate: >80%
```

---

## 16. Phase 2 & 3 Roadmap (Post-Launch)

### Phase 2 (Weeks 4-6)
- [ ] User accounts & order history
- [ ] Product reviews & ratings (3-5 star system)
- [ ] Wishlist functionality
- [ ] Email newsletter signup
- [ ] Advanced search & filters
- [ ] Mobile app (PWA)
- [ ] Live chat support (Tidio or similar)

### Phase 3 (Weeks 7-12)
- [ ] Referral program (give ₹100, get ₹100)
- [ ] Loyalty points system
- [ ] Personalized product recommendations (ML)
- [ ] Subscription boxes (monthly wellness)
- [ ] B2B wholesale portal
- [ ] Multi-language support (Hindi, Urdu)
- [ ] Marketplace integration (Amazon, Flipkart)
- [ ] Inventory forecasting & auto-replenishment

---

## 17. Glossary & Terminology

| Term | Definition |
|------|-----------|
| **SKU** | Stock Keeping Unit (product identifier) |
| **GMV** | Gross Merchandise Value (total orders) |
| **LCP** | Largest Contentful Paint (page speed metric) |
| **CMS** | Content Management System |
| **JWT** | JSON Web Token (authentication) |
| **PII** | Personally Identifiable Information |
| **UPI** | Unified Payments Interface (India) |
| **CAC** | Customer Acquisition Cost |
| **ROAS** | Return on Ad Spend |
| **KPI** | Key Performance Indicator |

---

## 18. Appendix: Recommended Tools & Services

### Project Management
- **Trello** or **Notion** - Task tracking
- **GitHub** - Version control
- **Linear** - Issue tracking (optional)

### Design & Assets
- **Figma** - Design system (UI components)
- **Unsplash/Pexels** - Free product images
- **Canva** - Quick graphics

### Development Tools
- **VS Code** - Code editor
- **Postman** - API testing
- **DBeaver** - Database management
- **Insomnia** - REST client

### Monitoring & Analytics
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Performance monitoring
- **UptimeRobot** - Uptime monitoring

### Email & SMS Testing
- **Mailtrap** - Email testing (dev)
- **Twilio Console** - SMS testing

---

## 19. Next Steps & Deliverables

### Week 0 (This Week)
- [ ] Get approval on this PRD
- [ ] Assign team members
- [ ] Set up development environment
- [ ] Create Supabase project
- [ ] Create Razorpay test account

### Week 1 Deliverables
- [ ] GitHub repo with initial commits
- [ ] React component library (buttons, cards, forms)
- [ ] Backend Express server boilerplate
- [ ] Database schema (SQL migrations)
- [ ] Auth system (register/login)

### Week 2 Deliverables
- [ ] Working checkout flow (end-to-end)
- [ ] Razorpay payment integration
- [ ] Email/SMS notifications
- [ ] Shipping calculation logic
- [ ] Admin dashboard (basic)

### Week 3 Deliverables
- [ ] Full SEO implementation
- [ ] Google Analytics 4 tracking
- [ ] Performance optimization
- [ ] Mobile testing complete
- [ ] Production deployment

---

## 20. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-02 | Project Team | Initial PRD Creation |
| 1.1 | TBD | TBD | Post-launch updates |

---

## Sign-Off

**Project Owner:** [Your Name]  
**Date:** 2026-04-02  
**Target Launch:** 2-3 weeks  
**Status:** ✅ Ready for Development

---

**Questions? Clarifications needed?** Please schedule a sync or update this document collaboratively.

---

*This PRD is a living document. Update it as requirements change, but maintain version control and communication with the team.*
