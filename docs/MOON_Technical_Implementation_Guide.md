# MOON E-Commerce Platform - Technical Implementation Guide

**Version:** 1.0  
**Date:** April 2, 2026  
**Target:** 2-3 Week Development Sprint

---

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Frontend Setup (React)](#frontend-setup-react)
3. [Backend Setup (Node.js)](#backend-setup-nodejs)
4. [Database Setup (Supabase)](#database-setup-supabase)
5. [Integration Guides](#integration-guides)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Checklist](#deployment-checklist)

---

## Environment Setup

### Prerequisites
```bash
# Required installations
- Node.js v18+
- npm or yarn
- Git
- VS Code or preferred IDE

# Verify installations
node --version   # v18.x.x or higher
npm --version    # 8.x.x or higher
git --version    # 2.x.x or higher
```

### Directory Structure
```
moon-ecommerce/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux state
│   │   ├── services/         # API services
│   │   ├── utils/            # Utilities
│   │   ├── styles/           # Tailwind CSS
│   │   └── App.jsx
│   ├── public/               # Static assets
│   ├── .env.local            # Local environment variables
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js Express server
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Data models
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utilities
│   │   ├── config/           # Configuration
│   │   └── server.js         # Entry point
│   ├── migrations/           # Database migrations
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── README.md
│
├── docs/                     # Documentation
├── .gitignore
└── README.md
```

---

## Frontend Setup (React)

### Step 1: Create React Project with Vite
```bash
# Create new Vite React project
npm create vite@latest moon-frontend -- --template react

# Navigate to project
cd moon-frontend

# Install dependencies
npm install

# Install additional packages
npm install \
  react-router-dom \
  @reduxjs/toolkit \
  react-redux \
  axios \
  tailwindcss \
  postcss \
  autoprefixer \
  clsx \
  @stripe/react-js \
  react-helmet-async \
  zustand

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 2: Project Configuration

**tailwind.config.js**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: '#FFB347',
        saffron: '#E53935',
        shilajit: '#1a1a1a',
        dates: '#3E2723',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

**.env.local**
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_xxxxx
VITE_GA_ID=G-xxxxx
VITE_ENV=development
```

### Step 3: Redux Store Setup

**src/store/index.js**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
  },
});
```

**src/store/slices/cartSlice.js**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### Step 4: API Service

**src/services/api.js**
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**src/services/productService.js**
```javascript
import api from './api';

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.get(`/products/search`, {
      params: { q: query },
    });
    return response.data;
  },
};
```

### Step 5: Key Components

**src/components/ProductCard.jsx**
```javascript
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

export function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
    }));
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
      <Link to={`/products/${product.id}`}>
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-64 object-cover hover:scale-105 transition"
        />
      </Link>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-saffron">
            ₹{product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

**src/components/Cart.jsx**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

export function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector(state => state.cart);

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/" className="text-saffron hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {items.map(item => (
        <div key={item.id} className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">
              ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
            </p>
          </div>
          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      
      <div className="text-right py-4 border-t-2">
        <p className="text-2xl font-bold">Total: ₹{totalPrice}</p>
        <Link to="/checkout" className="mt-4 inline-block bg-saffron text-white px-6 py-3 rounded-lg">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
```

### Step 6: Pages

**src/pages/HomePage.jsx**
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';

export function HomePage() {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        dispatch({ type: 'products/setProducts', payload: data });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>MOON - Premium Wellness Products | Organic Saffron, Honey, Shilajit</title>
        <meta name="description" content="Discover premium organic wellness products: Kashmiri Saffron, Sidr Honey, Pure Shilajit. Authentic Prophetic medicine for your health." />
        <meta name="keywords" content="saffron, honey, shilajit, organic, wellness, health" />
      </Helmet>

      <section className="py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
```

---

## Backend Setup (Node.js)

### Step 1: Create Express Server
```bash
# Create backend directory
mkdir moon-backend
cd moon-backend

# Initialize package.json
npm init -y

# Install dependencies
npm install \
  express \
  dotenv \
  cors \
  helmet \
  bcryptjs \
  jsonwebtoken \
  @supabase/supabase-js \
  axios \
  stripe \
  razorpay \
  twilio \
  @sendgrid/mail \
  joi \
  express-rate-limit

# Install dev dependencies
npm install -D \
  nodemon \
  eslint \
  prettier
```

### Step 2: Server Setup

**src/server.js**
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Routes
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import shippingRoutes from './routes/shipping.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**.env**
```
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx

# Auth
JWT_SECRET=your_super_secret_key_change_this

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
EMAIL_ADMIN=admin@moonbrand.com
```

### Step 3: Database Connection

**src/config/supabase.js**
```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle errors
export async function executeQuery(fn) {
  try {
    const { data, error } = await fn;
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
```

### Step 4: Authentication Middleware

**src/middleware/auth.js**
```javascript
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  });
};
```

### Step 5: API Routes

**src/routes/products.js**
```javascript
import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**src/routes/orders.js**
```javascript
import express from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      shippingCost,
      total,
    } = req.body;

    // Create order
    const orderId = uuidv4();
    const orderNumber = `MN-${Date.now()}`;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        id: orderId,
        user_id: req.user.id,
        order_number: orderNumber,
        status: 'pending',
        shipping_cost: shippingCost,
        total: total,
        customer_email: req.user.email,
        customer_phone: req.user.phone,
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Add order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json({
      order_id: orderId,
      order_number: orderNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Step 6: Payment Integration

**src/routes/payments.js**
```javascript
import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';
import { notificationService } from '../services/notification.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay order
router.post('/razorpay', authMiddleware, async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId,
        userId: req.user.id,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save payment order ID
    const { error } = await supabase
      .from('payments')
      .insert([{
        order_id: orderId,
        razorpay_order_id: razorpayOrder.id,
        amount: amount,
        status: 'pending',
      }]);

    if (error) throw error;

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      key: process.env.RAZORPAY_KEY,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    // Verify signature
    const hash = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (hash !== razorpaySignature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update payment status
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        status: 'captured',
      })
      .eq('razorpay_order_id', razorpayOrderId);

    if (paymentError) throw paymentError;

    // Update order status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', orderId)
      .select()
      .single();

    if (orderError) throw orderError;

    // Send confirmations
    await notificationService.sendOrderConfirmation(order);

    res.json({
      success: true,
      orderId: orderId,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Step 7: Notification Service

**src/services/notification.js**
```javascript
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const notificationService = {
  // Send order confirmation email
  sendOrderConfirmation: async (order) => {
    try {
      await sgMail.send({
        to: order.customer_email,
        from: process.env.EMAIL_FROM,
        subject: `Order Confirmation #${order.order_number}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Order Number: ${order.order_number}</p>
          <p>Total: ₹${order.total}</p>
          <p>Your order will be shipped within 2 business days.</p>
          <p>Track your order at: ${process.env.FRONTEND_URL}/orders/${order.id}</p>
        `,
      });
      console.log('Order confirmation email sent');
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  },

  // Send SMS notification
  sendOrderSMS: async (phone, message) => {
    try {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: phone,
      });
      console.log('SMS sent');
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  },

  // Send WhatsApp notification
  sendWhatsApp: async (phone, message) => {
    try {
      await twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_PHONE}`,
        to: `whatsapp:${phone}`,
        body: message,
      });
      console.log('WhatsApp message sent');
    } catch (error) {
      console.error('Failed to send WhatsApp:', error);
    }
  },
};
```

---

## Database Setup (Supabase)

### Step 1: Create Supabase Project
```bash
1. Go to https://supabase.com
2. Click "New Project"
3. Select region closest to India (Asia / Singapore)
4. Copy Project URL and Anon Key
5. Save in .env files (frontend & backend)
```

### Step 2: Run Database Migrations
```sql
-- Execute this SQL in Supabase SQL Editor

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  theme VARCHAR(50),
  meta_title VARCHAR(255),
  meta_description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  total DECIMAL(10, 2),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(15),
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT,
  unit_price DECIMAL(10, 2),
  subtotal DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping zones table
CREATE TABLE shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_name VARCHAR(100),
  states TEXT[],
  cost DECIMAL(10, 2),
  estimated_days INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100),
  product_id UUID REFERENCES products(id),
  properties JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, slug, description, price, image_url, category, theme, meta_title, meta_description) VALUES
('Kashmiri Saffron', 'saffron', 'Hand-picked Mongra A++ grade saffron', 850, 'https://...', 'Spices', 'saffron', 'Kashmiri Saffron | Premium Mongra A++', 'Buy authentic Kashmiri Saffron online'),
('Sidr Honey', 'honey', 'Pure Yemeni Sidr Honey', 1500, 'https://...', 'Honey', 'honey', 'Sidr Honey | Raw Yemeni Honey', 'Buy pure Sidr Honey from Yemen'),
('Pure Shilajit', 'shilajit', 'Himalayan Resin', 1999, 'https://...', 'Supplements', 'shilajit', 'Pure Shilajit | Himalayan Gold', 'Buy authentic Shilajit online');

-- Insert shipping zones
INSERT INTO shipping_zones (zone_name, states, cost, estimated_days) VALUES
('North', ARRAY['Delhi', 'Punjab', 'Haryana'], 50, 2),
('South', ARRAY['Karnataka', 'Tamil Nadu'], 60, 3),
('West', ARRAY['Maharashtra', 'Gujarat'], 50, 2),
('East', ARRAY['West Bengal', 'Bihar'], 80, 4),
('Northeast', ARRAY['Assam', 'Manipur'], 100, 5);
```

---

## Integration Guides

### Razorpay Frontend Integration

**src/pages/Checkout.jsx**
```javascript
import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

export function CheckoutPage() {
  const { items, totalPrice } = useSelector(state => state.cart);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order
      const orderRes = await api.post('/orders', {
        items,
        shippingAddress: formData,
        total: totalPrice,
      });

      const { order_id: orderId } = orderRes.data;

      // Get Razorpay order details
      const paymentRes = await api.post('/payments/razorpay', {
        orderId,
        amount: totalPrice,
      });

      // Open Razorpay modal
      const options = {
        key: paymentRes.data.key,
        order_id: paymentRes.data.razorpayOrderId,
        amount: paymentRes.data.amount * 100,
        currency: 'INR',
        handler: async (response) => {
          // Verify payment
          const verifyRes = await api.post('/payments/verify', {
            razorpayOrderId: paymentRes.data.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId,
          });

          if (verifyRes.data.success) {
            alert('Payment successful!');
            // Redirect to order confirmation
            window.location.href = `/orders/${orderId}`;
          }
        },
        prefill: {
          email: formData.email,
          contact: formData.phone,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form className="mb-6">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <textarea
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
      </form>

      <div className="border-t pt-4 mb-6">
        <p className="text-2xl font-bold">Total: ₹{totalPrice}</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-saffron text-white py-3 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </button>
    </div>
  );
}
```

### Google Analytics Setup

**src/services/analytics.js**
```javascript
// Initialize GA4
export const initGA = () => {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GA_ID);
};

// Track events
export const trackEvent = (eventName, eventParams) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track purchase
export const trackPurchase = (orderId, items, value) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: value,
    currency: 'INR',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};
```

**index.html**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## Testing Strategy

### Frontend Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**src/__tests__/ProductCard.test.jsx**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';
import { Provider } from 'react-redux';
import { store } from '../store';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Saffron',
    price: 850,
    description: 'Premium saffron',
    image_url: 'test.jpg',
  };

  it('renders product card', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );
    expect(screen.getByText('Saffron')).toBeInTheDocument();
    expect(screen.getByText('₹850')).toBeInTheDocument();
  });

  it('handles add to cart', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    expect(screen.getByText('Added!')).toBeInTheDocument();
  });
});
```

### Backend Testing

```bash
npm install -D jest supertest
```

**src/__tests__/products.test.js**
```javascript
import request from 'supertest';
import app from '../server';

describe('Products API', () => {
  it('should get all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get single product', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe('1');
  });
});
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (npm test)
- [ ] No console errors or warnings
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Razorpay credentials verified
- [ ] Email/SMS/WhatsApp templates tested
- [ ] Analytics configured
- [ ] SSL certificates generated

### Frontend Deployment (Vercel)

```bash
# Build production
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Backend Deployment (Railway)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Verification Checklist
- [ ] Website loads in <3 seconds
- [ ] Mobile responsive on all sizes
- [ ] All products display correctly
- [ ] Add to cart functionality works
- [ ] Checkout flow completes
- [ ] Razorpay payment processes
- [ ] Order confirmation email sent
- [ ] SMS notifications received
- [ ] Admin dashboard accessible
- [ ] Analytics tracking events
- [ ] SEO meta tags visible
- [ ] No 404 errors

---

## Quick Start Commands

```bash
# Frontend
cd frontend
npm install
npm run dev  # Start development server
npm run build  # Build for production
npm test  # Run tests

# Backend
cd backend
npm install
npm start  # Start server
npm run dev  # Start with nodemon

# Database
# Go to Supabase dashboard and run SQL migrations

# Deployment
vercel --prod  # Deploy frontend
railway up  # Deploy backend
```

---

**Next Steps:**
1. Set up repository
2. Create Supabase project
3. Create Razorpay account
4. Set up environment variables
5. Begin development with Week 1 tasks

**Questions? Issues?** Create an issue on GitHub or schedule a sync.
