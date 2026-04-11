# MOON Website Redesign Report: Furnexa Design System Analysis & Implementation Guide

**Date:** April 2, 2026  
**Project:** MOON E-Commerce Website Transformation  
**Reference:** Furnexa (https://furnexa.framer.website/)  
**Status:** Design Analysis & Strategy Document

---

## Executive Summary

Your MOON website has a strong foundation with a dark, premium aesthetic and product-focused layout. The Furnexa website demonstrates a more **refined, minimalist approach** with several key advantages:

✅ **Carousel/Slider hero with auto-rotating products**  
✅ **Dynamic theme color switching per product**  
✅ **Smooth animations and transitions**  
✅ **Clean typography hierarchy**  
✅ **Strategic whitespace usage**  
✅ **Product context-aware design**  

**Recommendation:** Implement a **hybrid approach** combining your current dark luxury aesthetic with Furnexa's dynamic theming and carousel mechanics.

---

## Part 1: Current State Analysis

### 1.1 MOON Website (Your Current Design)

#### Strengths ✅
- **Dark luxury aesthetic** - Premium, sophisticated feel
- **Large cinematic hero image** - Product-focused
- **Clear product showcase** - Shilajit featured prominently
- **Defined product hierarchy** - Ritual section shows multiple products
- **Professional typography** - Bold headings (Shilajit text)
- **Strong CTA buttons** - Indigo/purple accent color (#5E67AA approximated)
- **Storytelling approach** - "The Art of Alchemical Restoration" section

#### Weaknesses ❌
- **Static hero section** - Only one product at a time (though animated)
- **No automatic product carousel** - User must manually click to switch products
- **Limited theme switching** - Background changes but color system not fully dynamic
- **Sequential product layout** - Products appear in grid below, not in hero
- **Darker overall vibe** - May reduce perceived product quality/clarity
- **Less whitespace** - Dense information layout

---

### 1.2 Furnexa Website (Reference Design)

#### Strengths ✅
- **Auto-rotating hero carousel** - Cycles through products every 5-7 seconds
- **Dynamic color theming** - Background and accent colors change per product
- **Minimalist layout** - Heavy use of whitespace, focus on product
- **Clean typography** - Sans-serif, well-spaced
- **Soft, neutral backgrounds** - Off-white, beige, light gray (#F5F5F5 range)
- **Product categories section** - Grid of 6-8 product cards below hero
- **"Best Sellers" section** - Highlighted featured products
- **Blog/lifestyle integration** - "Our Blogs" section with images
- **Membership/loyalty section** - Bottom feature for recurring engagement

#### Weaknesses ❌
- **Light backgrounds** - Less premium/luxury feel
- **Less storytelling** - More transactional
- **Generic category names** - Doesn't convey brand values
- **Moderate animations** - Could be more dramatic

---

## Part 2: Key Differences & Design Patterns

### 2.1 Hero Section Comparison

| Aspect | MOON Current | Furnexa | Recommendation |
|--------|-------------|---------|-----------------|
| **Layout** | Static, full-bleed | Carousel, rotating | **Rotating carousel with product context** |
| **Auto-rotation** | Manual click | Auto 5-7 seconds | **Auto with manual override** |
| **Background** | Dark (#1a1a1a) | Light (#F5F5F5) | **Dark base, theme accent overlay** |
| **Product Image** | Large, cinematic | Large, product-focused | **Keep cinematic, add context** |
| **Typography** | Bold overlay text | Clean, minimal | **Bold + minimal hybrid** |
| **Color Theme** | Purple accent (#5E67AA) | Gray/taupe/cream | **Dynamic: Saffron, Honey, Shilajit** |
| **CTA Placement** | Below title | Right side | **Dynamic position based on product** |
| **Info Display** | Descriptive text | Minimal text | **Smart info display** |

### 2.2 Product Grid Comparison

| Aspect | MOON Current | Furnexa | Recommendation |
|--------|-------------|---------|-----------------|
| **Grid Layout** | Modular, asymmetric | Clean 3-4 column | **Responsive 3-4 column** |
| **Card Style** | Large images, info below | Minimal, clean | **Clean cards, hover reveal** |
| **Product Focus** | Detailed descriptions | Category/minimal | **Smart product cards** |
| **Hover State** | Image zoom | Subtle shadow | **Zoom + color highlight** |
| **Background** | Light gray (#F6F6F9) | Very light white | **Maintain current, add theme tint** |

---

## Part 3: Design Changes Required

### 3.1 Hero Section Transformation

#### Current State (MOON):
```
┌─────────────────────────────────────┐
│ Static Image with Text Overlay      │
│ - Large Shilajit title              │
│ - Descriptive text                  │
│ - CTA buttons (Acquire, Explore)    │
│ - Right side: Product card          │
└─────────────────────────────────────┘
```

#### Target State (Furnexa-inspired):
```
┌─────────────────────────────────────┐
│ Hero Carousel (Auto-rotating)       │
│                                     │
│ [Saffron] ← [Honey] → [Shilajit]   │
│                                     │
│ Auto-switch every 6 seconds         │
│ Theme colors update dynamically     │
│ ────────────────────────────────────│
│ Left: Large Product Image           │ Theme Swatch
│ - No background (transparent)       │ ───────────
│ - High-res, cropped product         │ Dominant Color
│ - Shadow/depth effect               │ Accent Color
│                                     │ Text Color
│ Right: Smart Product Info           │
│ - Product Name                      │
│ - Descriptive tagline               │
│ - Key benefits (3-4 bullet points)  │
│ - Price                             │
│ - 2 CTAs (Acquire, Explore)         │
│                                     │
│ Bottom: Carousel indicators         │
│ - 3 dots (Saffron, Honey, Shilajit)│
│ - Click to jump to product          │
└─────────────────────────────────────┘
```

### 3.2 Color Theme Mapping

Create a **design token system** for each product:

#### Theme 1: Kashmiri Saffron
```
Primary: #E53935 (Deep Red/Crimson)
Secondary: #FFD700 (Gold)
Accent: #FF6B35 (Warm Orange)
Text Primary: #FFFFFF
Text Secondary: #FFE0B2 (Light Orange-tinted)
Background: #1a1a1a (Very dark, stays dark)
Hover Overlay: rgba(229, 57, 53, 0.1)
```

**Application:**
- Hero section border/accent line: #E53935
- CTA button primary: #E53935 → #FF6B35 on hover
- Carousel indicator (active): #E53935
- Product card highlight: Subtle #E53935 tint
- Section divider: #E53935

#### Theme 2: Sidr Honey
```
Primary: #FFB347 (Golden Orange/Honey)
Secondary: #FFF8DC (Cream)
Accent: #FF8C00 (Dark Orange)
Text Primary: #FFFFFF
Text Secondary: #F5DEB3 (Wheat)
Background: #1a1a1a (Keep dark for contrast)
Hover Overlay: rgba(255, 179, 71, 0.1)
```

**Application:**
- Hero section border/accent line: #FFB347
- CTA button primary: #FFB347 → #FF8C00 on hover
- Carousel indicator (active): #FFB347
- Product card highlight: Subtle #FFB347 tint
- Section divider: #FFB347

#### Theme 3: Pure Shilajit
```
Primary: #424242 (Dark Gray/Charcoal)
Secondary: #9E9E9E (Medium Gray)
Accent: #795548 (Brown/Earth)
Text Primary: #FFFFFF
Text Secondary: #D7CCC8 (Light Brown)
Background: #1a1a1a (Complements well)
Hover Overlay: rgba(66, 66, 66, 0.1)
```

**Application:**
- Hero section border/accent line: #424242
- CTA button primary: #795548 → #A1887F on hover
- Carousel indicator (active): #795548
- Product card highlight: Subtle #795548 tint
- Section divider: #795548

### 3.3 Product Image Specifications

#### Background Handling

**CURRENT APPROACH:** Your images have backgrounds (black, product environments)

**RECOMMENDED APPROACH (Furnexa-style):**

**Option A: Keep Backgrounds (60% Transparency)**
✅ Maintains current cinematic feel  
✅ Easier implementation  
✅ Shows product in context  
❌ Less clean visual  
❌ Harder to change theme dynamically  

**Option B: Remove Backgrounds (Recommended)**
✅ Clean, focused product  
✅ Easy theme color application  
✅ Better for carousel rotation  
✅ Luxury/premium aesthetic  
✅ Allows shadow/depth effects  
❌ Requires image editing (Photoshop/Figma)  
❌ New photography if needed  

**IMPLEMENTATION:** Use **Option B** (Remove Backgrounds)

#### Image Editing Process

For each product, create 3 versions:

1. **Original (Keep archived)**
   - Original with context background
   
2. **Transparent PNG (Production)**
   - Background removed
   - Clean edges
   - High-res (2000px+ width)
   - PNG-24 or WebP format
   
3. **Web-optimized**
   - 1200px width for hero
   - 600px width for grids
   - WebP format with PNG fallback
   - Compressed to <200KB

**Tools for Background Removal:**
- Adobe Photoshop (Generative Fill, Remove Tool)
- Figma (built-in background removal)
- Photoscissors.com (online, free)
- Removebg.com (API available)
- ImageMagick (command-line, batch processing)

#### Image Positioning & Depth

```css
.hero-product-image {
  /* Transparent background */
  background: transparent;
  
  /* Depth effect */
  filter: drop-shadow(
    0 20px 60px rgba(0, 0, 0, 0.4)
  );
  
  /* Slight rotation for dynamic feel */
  transform: perspective(1200px) rotateY(-5deg) scale(1.05);
  
  /* Smooth transitions */
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Hover state */
.hero-product-image:hover {
  transform: perspective(1200px) rotateY(0deg) scale(1.1);
}
```

---

## Part 4: Animation Strategy

### 4.1 Hero Carousel Animation

#### Auto-Rotation (Every 6 seconds)

```javascript
// Pseudo-code for carousel logic
const products = ['saffron', 'honey', 'shilajit'];
let currentIndex = 0;

const rotateHero = () => {
  currentIndex = (currentIndex + 1) % products.length;
  const newTheme = products[currentIndex];
  
  // Smooth transition
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Slide animation
  animateHeroTransition(newTheme);
};

// Auto-rotate every 6 seconds
setInterval(rotateHero, 6000);
```

#### Transition Animation (Fade + Slide)

```css
@keyframes heroFadeOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50px);
  }
}

@keyframes heroFadeIn {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-content.exiting {
  animation: heroFadeOut 0.6s ease-out forwards;
}

.hero-content.entering {
  animation: heroFadeIn 0.6s ease-out forwards;
}
```

#### Color Theme Transition

```css
:root {
  --transition-duration: 0.8s;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* All theme colors transition smoothly */
[data-theme] {
  transition: 
    --theme-primary var(--transition-duration) var(--transition-timing),
    --theme-accent var(--transition-duration) var(--transition-timing),
    --theme-secondary var(--transition-duration) var(--transition-timing);
}
```

### 4.2 Carousel Indicator Animation

```jsx
// React component example
export function CarouselIndicators({ current, total, onSelect }) {
  return (
    <div className="carousel-indicators">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          className={`indicator ${idx === current ? 'active' : ''}`}
          onClick={() => onSelect(idx)}
          aria-label={`Go to product ${idx + 1}`}
        >
          <span className="dot" />
        </button>
      ))}
    </div>
  );
}
```

```css
.carousel-indicators {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.indicator {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.indicator .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--theme-accent, #999);
  transition: all 0.3s ease;
  opacity: 0.4;
  display: block;
}

.indicator:hover .dot {
  opacity: 0.7;
  transform: scale(1.1);
}

.indicator.active .dot {
  opacity: 1;
  transform: scale(1.3);
  background: var(--theme-primary);
}
```

### 4.3 Product Card Hover Animations

```css
.product-card {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-card:hover {
  /* Lift effect */
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  /* Subtle color highlight */
  border-color: var(--theme-primary);
}

.product-card-image {
  overflow: hidden;
  border-radius: 4px;
}

.product-card-image img {
  transition: transform 0.4s ease;
}

.product-card:hover .product-card-image img {
  transform: scale(1.08);
}
```

### 4.4 Theme Color Transition

```javascript
// Smooth CSS variable transition
const switchTheme = (productKey) => {
  const themeConfig = {
    saffron: {
      '--theme-primary': '#E53935',
      '--theme-secondary': '#FFD700',
      '--theme-accent': '#FF6B35',
    },
    honey: {
      '--theme-primary': '#FFB347',
      '--theme-secondary': '#FFF8DC',
      '--theme-accent': '#FF8C00',
    },
    shilajit: {
      '--theme-primary': '#424242',
      '--theme-secondary': '#9E9E9E',
      '--theme-accent': '#795548',
    },
  };

  const root = document.documentElement;
  
  // Apply transition
  root.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Update colors
  Object.entries(themeConfig[productKey]).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
```

---

## Part 5: Step-by-Step Implementation Plan

### Phase 1: Asset Preparation (Week 1)

#### Step 1: Image Background Removal
- [ ] Take original product images (3 products: Saffron, Honey, Shilajit)
- [ ] Use Figma or Photoshop to remove backgrounds
- [ ] Export as PNG-24 (transparent background)
- [ ] Create 3 sizes:
  - Hero: 1200px width
  - Grid: 600px width
  - Thumbnail: 300px width
- [ ] Optimize to WebP with PNG fallback
- [ ] Store in: `/public/images/products/`

**File structure:**
```
/public/images/products/
├── saffron/
│   ├── hero.webp
│   ├── hero.png
│   ├── grid.webp
│   └── grid.png
├── honey/
│   ├── hero.webp
│   ├── hero.png
│   ├── grid.webp
│   └── grid.png
└── shilajit/
    ├── hero.webp
    ├── hero.png
    ├── grid.webp
    └── grid.png
```

#### Step 2: Design Token Setup
- [ ] Define color palettes for all 3 products
- [ ] Create Tailwind config with CSS variables
- [ ] Test color transitions
- [ ] Document hex codes

### Phase 2: Hero Carousel Component (Week 1-2)

#### Step 3: Build Carousel Component
```jsx
// components/HeroCarousel.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export function HeroCarousel() {
  const [currentProduct, setCurrentProduct] = useState(0);
  const { switchTheme } = useTheme();
  
  const products = [
    {
      id: 'saffron',
      name: 'Kashmiri Saffron',
      tagline: 'Ancient Wisdom, Modern Science',
      description: 'Hand-picked from Pampore...',
      price: '₹850',
      image: '/images/products/saffron/hero.webp',
      color: '#E53935',
    },
    {
      id: 'honey',
      name: 'Sidr Honey',
      tagline: 'Liquid Gold from Yemen',
      description: 'Pure Yemeni Sidr Honey...',
      price: '₹1500',
      image: '/images/products/honey/hero.webp',
      color: '#FFB347',
    },
    {
      id: 'shilajit',
      name: 'Pure Shilajit',
      tagline: 'Mountain Strength',
      description: 'Pure Himalayan Resin...',
      price: '₹1999',
      image: '/images/products/shilajit/hero.webp',
      color: '#424242',
    },
  ];

  useEffect(() => {
    // Auto-rotate every 6 seconds
    const interval = setInterval(() => {
      const nextIndex = (currentProduct + 1) % products.length;
      setCurrentProduct(nextIndex);
      switchTheme(products[nextIndex].id);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentProduct]);

  const handleProductSelect = (index) => {
    setCurrentProduct(index);
    switchTheme(products[index].id);
  };

  return (
    <section className="hero-carousel">
      <div className="hero-content">
        {/* Left: Product Image */}
        <div className="hero-image-container">
          <img
            src={products[currentProduct].image}
            alt={products[currentProduct].name}
            className="hero-product-image"
          />
        </div>

        {/* Right: Product Info */}
        <div className="hero-info">
          <p className="hero-tagline">
            {products[currentProduct].tagline}
          </p>
          <h1 className="hero-title">
            {products[currentProduct].name}
          </h1>
          <p className="hero-description">
            {products[currentProduct].description}
          </p>
          
          {/* Key Benefits */}
          <ul className="hero-benefits">
            <li>Premium Quality</li>
            <li>100% Organic</li>
            <li>Ethically Sourced</li>
          </ul>

          {/* Price */}
          <div className="hero-pricing">
            <span className="price-label">Price</span>
            <span className="price-value">
              {products[currentProduct].price}
            </span>
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <button className="btn btn-primary">
              Acquire Essence
            </button>
            <button className="btn btn-secondary">
              Explore Collection
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        {products.map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === currentProduct ? 'active' : ''}`}
            onClick={() => handleProductSelect(idx)}
            aria-label={`Go to ${products[idx].name}`}
          >
            <span className="dot" />
          </button>
        ))}
      </div>
    </section>
  );
}
```

#### Step 4: Carousel Styling
```css
/* styles/hero-carousel.css */

.hero-carousel {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  padding-top: 70px; /* Account for navbar */
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  height: 100%;
  align-items: center;
  padding: 60px;
  max-width: 1920px;
  margin: 0 auto;
}

.hero-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 600px;
}

.hero-product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4));
  animation: heroImageEnter 0.8s ease-out;
}

@keyframes heroImageEnter {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-tagline {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--theme-accent);
  animation: heroInfoEnter 0.8s ease-out 0.1s both;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  animation: heroInfoEnter 0.8s ease-out 0.2s both;
}

.hero-description {
  font-size: 16px;
  line-height: 1.6;
  color: #ccc;
  animation: heroInfoEnter 0.8s ease-out 0.3s both;
}

.hero-benefits {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: heroInfoEnter 0.8s ease-out 0.4s both;
}

.hero-benefits li {
  font-size: 14px;
  color: #aaa;
  padding-left: 24px;
  position: relative;
}

.hero-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--theme-primary);
  font-weight: 800;
}

.hero-pricing {
  display: flex;
  align-items: baseline;
  gap: 12px;
  animation: heroInfoEnter 0.8s ease-out 0.5s both;
}

.price-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #888;
}

.price-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--theme-primary);
}

.hero-ctas {
  display: flex;
  gap: 16px;
  animation: heroInfoEnter 0.8s ease-out 0.6s both;
}

@keyframes heroInfoEnter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-indicators {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s ease;
}

.indicator .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: block;
  transition: all 0.3s ease;
}

.indicator:hover .dot {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.indicator.active .dot {
  background: var(--theme-primary);
  transform: scale(1.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px;
  }

  .hero-image-container {
    height: 400px;
  }

  .hero-title {
    font-size: 36px;
  }
}

@media (max-width: 640px) {
  .hero-carousel {
    padding-top: 60px;
  }

  .hero-content {
    padding: 24px;
    gap: 24px;
  }

  .hero-image-container {
    height: 300px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-ctas {
    flex-direction: column;
  }

  .carousel-indicators {
    bottom: 20px;
  }
}
```

### Phase 3: Product Grid & Other Sections (Week 2)

#### Step 5: Update Product Grid Component
```jsx
// components/ProductGrid.jsx - Updated with theme-aware styling

export function ProductGrid() {
  const products = [
    {
      id: 'saffron',
      name: 'Kashmiri Saffron',
      price: '₹850',
      image: '/images/products/saffron/grid.webp',
      category: 'Spices',
    },
    // ... other products
  ];

  return (
    <section className="product-grid-section">
      <div className="container">
        <h2 className="section-heading">The Collection</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <div className="product-footer">
                  <span className="price">{product.price}</span>
                  <button className="add-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

```css
.product-grid-section {
  padding: 80px 24px;
  background: var(--bg-secondary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.product-card {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--theme-primary);
  border: 2px solid var(--theme-primary);
}

.product-image {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

.product-info {
  padding: 16px;
}

.product-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.product-info .category {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #000;
}

.add-btn {
  background: var(--theme-primary);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: var(--theme-accent);
  transform: scale(1.05);
}
```

#### Step 6: Update Theme System
```javascript
// hooks/useTheme.js - Enhanced version

import { useEffect, useState } from 'react';

const themeConfig = {
  saffron: {
    '--theme-primary': '#E53935',
    '--theme-secondary': '#FFD700',
    '--theme-accent': '#FF6B35',
    '--text-primary': '#FFFFFF',
    '--bg-primary': '#1a1a1a',
    '--border-highlight': '#E53935',
  },
  honey: {
    '--theme-primary': '#FFB347',
    '--theme-secondary': '#FFF8DC',
    '--theme-accent': '#FF8C00',
    '--text-primary': '#FFFFFF',
    '--bg-primary': '#1a1a1a',
    '--border-highlight': '#FFB347',
  },
  shilajit: {
    '--theme-primary': '#424242',
    '--theme-secondary': '#9E9E9E',
    '--theme-accent': '#795548',
    '--text-primary': '#FFFFFF',
    '--bg-primary': '#1a1a1a',
    '--border-highlight': '#795548',
  },
};

export function useTheme() {
  const [theme, setTheme] = useState('saffron');

  const switchTheme = (newTheme) => {
    const root = document.documentElement;
    
    // Smooth transition
    root.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Apply theme colors
    Object.entries(themeConfig[newTheme] || {}).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    setTheme(newTheme);
    localStorage.setItem('preferredTheme', newTheme);
  };

  useEffect(() => {
    // Restore saved theme
    const savedTheme = localStorage.getItem('preferredTheme') || 'saffron';
    switchTheme(savedTheme);
  }, []);

  return { theme, switchTheme };
}
```

### Phase 4: Testing & Optimization (Week 3)

#### Step 7: Performance Testing
- [ ] Test carousel on mobile devices
- [ ] Verify color transitions are smooth
- [ ] Check image load times
- [ ] Lighthouse performance score
- [ ] Cross-browser testing

#### Step 8: Accessibility Testing
- [ ] Keyboard navigation of carousel
- [ ] Screen reader testing
- [ ] Color contrast verification
- [ ] Focus states visible
- [ ] ARIA labels for carousel

### Phase 5: Deployment (Week 3)

#### Step 9: Deploy Changes
- [ ] Build production version
- [ ] Deploy to staging
- [ ] Final QA testing
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Part 6: Specific Design Recommendations

### 6.1 Background Strategy

**CURRENT:** Dark background (#1a1a1a) with product overlay  
**RECOMMENDATION:** Keep dark background, use theme color as accent

```css
/* Hero background with theme accent */
.hero-carousel {
  background: linear-gradient(
    135deg,
    #1a1a1a 0%,
    #0d0d0d 100%
  );
  
  /* Add subtle theme color glow on hover */
  position: relative;
}

.hero-carousel::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(
    circle,
    var(--theme-primary),
    transparent
  );
  opacity: 0.05;
  pointer-events: none;
}
```

### 6.2 Product Image Specifications

**FINAL FORMAT:**
- Format: PNG-24 (transparency) or WebP
- Size: 1200px width × variable height (maintain aspect ratio)
- Background: Transparent (removed)
- Resolution: 72 DPI (web)
- Compression: Optimized for web (<200KB per image)

**SHADOW/DEPTH EFFECTS:**
```css
.hero-product-image {
  filter: drop-shadow(
    0 30px 80px rgba(0, 0, 0, 0.5)
  );
}
```

### 6.3 Animation Timing

| Animation | Duration | Timing Function |
|-----------|----------|-----------------|
| Carousel rotate | 6 seconds | - |
| Hero content fade | 0.6s | ease-out |
| Product image slide | 0.8s | ease-out |
| Color theme transition | 0.8s | cubic-bezier(0.4, 0, 0.2, 1) |
| Button hover | 0.2s | ease |
| Indicator pulse | 0.3s | ease |

### 6.4 Responsive Behavior

**Desktop (1440px+):**
- Hero: 2-column grid (image left, info right)
- Carousel indicators: Bottom center
- Full animations enabled

**Tablet (768px - 1024px):**
- Hero: 1-column stack
- Image above, info below
- Smaller font sizes

**Mobile (320px - 768px):**
- Hero: Full-screen, centered
- Product image: 300px max height
- Smaller typography
- Carousel indicators: Smaller dots
- CTAs: Full-width stacked

---

## Part 7: Comparison Matrix

### Before vs. After

| Element | Before (Current MOON) | After (Furnexa-Inspired) | Impact |
|---------|----------------------|------------------------|---------| |Hero | Static product | Auto-rotating carousel | Engagement ↑ |Color Theme | Single purple accent | Dynamic per product | Visual interest ↑ |Product Images | With background | Transparent, shadowed | Clarity ↑ |Animations | Limited | Rich, smooth transitions | Premium feel ↑ |Product Focus | Descriptive | Clean, essential info | Usability ↑ |Auto-rotation | None | 6-second auto-switch | Engagement ↑ |Manual Control | Click buttons | Dot indicators | UX improvement ↑ |Background | Dark, solid | Dark with subtle glow | Visual depth ↑ |Typography | Bold overlay | Bold + minimal | Readability ↑ |Responsive | Good | Optimized mobile-first | Mobile UX ↑ |

---

## Part 8: Technical Implementation Checklist

### Code Changes Required

- [ ] Create `HeroCarousel.jsx` component
- [ ] Update `useTheme.js` hook with theme config
- [ ] Add carousel CSS (`hero-carousel.css`)
- [ ] Update `tailwind.config.js` with CSS variables
- [ ] Remove old hero section
- [ ] Update product grid component
- [ ] Optimize and upload product images (transparent)
- [ ] Test theme switching on all products
- [ ] Test carousel rotation
- [ ] Test responsive behavior
- [ ] Update navigation for seamless UX
- [ ] Add keyboard navigation support (arrow keys)
- [ ] Add touch swipe support for mobile

### Files to Modify

```
src/
├── components/
│   ├── HeroCarousel.jsx (NEW)
│   ├── ProductGrid.jsx (MODIFY)
│   └── Navigation.jsx (MODIFY - if needed)
├── hooks/
│   └── useTheme.js (ENHANCE)
├── styles/
│   ├── hero-carousel.css (NEW)
│   ├── globals.css (MODIFY)
│   └── animations.css (NEW)
└── pages/
    └── index.jsx (MODIFY - swap hero component)
```

---

## Part 9: Additional Recommendations

### 1. Add Keyboard Navigation
```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
    } else if (e.key === 'ArrowRight') {
      setCurrentProduct((prev) => (prev + 1) % products.length);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### 2. Add Touch Swipe Support
```javascript
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => setCurrentProduct((prev) => (prev + 1) % products.length),
  onSwipedRight: () => setCurrentProduct((prev) => (prev - 1 + products.length) % products.length),
  trackMouse: true,
});

return <section {...handlers}>...</section>;
```

### 3. Add Loading Skeleton
```jsx
// During image load transition
{isLoading && (
  <div className="skeleton-loader">
    <div className="skeleton skeleton-product" />
  </div>
)}
```

### 4. Pause Carousel on Hover
```javascript
const [isHovered, setIsHovered] = useState(false);

useEffect(() => {
  if (isHovered) return; // Don't auto-rotate while hovering
  
  const interval = setInterval(() => {
    // rotate logic
  }, 6000);

  return () => clearInterval(interval);
}, [isHovered]);
```

### 5. Add Analytics Tracking
```javascript
const trackProductView = (productId) => {
  // Send to analytics
  gtag.event('view_item', {
    items: [{ item_id: productId }],
  });
};
```

---

## Part 10: Summary & Next Steps

### What Needs to be Done

✅ **Remove product backgrounds** (Photoshop/Figma)  
✅ **Create carousel component** (React)  
✅ **Implement dynamic theming** (CSS Variables)  
✅ **Add smooth animations** (CSS + JavaScript)  
✅ **Update product grid** (Component styling)  
✅ **Add carousel indicators** (Dot navigation)  
✅ **Test across devices** (Responsive design)  
✅ **Optimize performance** (Image compression, code splitting)  
✅ **Enhance accessibility** (ARIA labels, keyboard nav)  

### How to Replicate Furnexa Design

**Step-by-step:**
1. Remove backgrounds from images (transparent PNG)
2. Build auto-rotating carousel (every 6 seconds)
3. Implement dynamic color theme per product
4. Add smooth CSS transitions
5. Optimize product images for web
6. Test on mobile devices
7. Deploy and monitor

### Key Differences You'll Notice

- **More engaging:** Auto-rotation captures attention
- **Cleaner look:** Transparent backgrounds focus on products
- **Premium feel:** Smooth animations and color transitions
- **Better mobile:** Responsive carousel with touch support
- **Accessibility:** Keyboard and screen reader support

### Expected Results

- 📈 Increased time on page
- 🎯 Faster product discovery
- ✨ Premium brand perception
- 📱 Better mobile experience
- ♿ Improved accessibility compliance

---

## Timeline & Deliverables

### Week 1
- Day 1-2: Image background removal
- Day 3-5: Carousel component development
- **Deliverable:** Working carousel with theme switching

### Week 2
- Day 6-8: Animation refinement
- Day 9-10: Product grid updates
- **Deliverable:** Fully functional hero with products

### Week 3
- Day 11-12: Testing & optimization
- Day 13-15: Deployment & monitoring
- **Deliverable:** Live on production

---

## Resources & References

### Design Resources
- **Figma:** Background removal tutorials
- **Removebg.com:** Batch background removal (API available)
- **ImageMagick:** Command-line batch processing
- **TinyPNG/Squoosh:** Image compression

### Development Resources
- **GSAP:** Animation library (already recommended in landing page doc)
- **React Swipeable:** Touch gesture library
- **Next.js Image:** Optimized image component
- **Tailwind CSS:** Utility-first styling

### Reference Sites
- **Furnexa:** https://furnexa.framer.website/ (Design inspiration)
- **E-commerce Examples:** 
  - Allbirds.com (carousel hero)
  - JoinClaude.ai (smooth transitions)
  - Linear.app (minimalist design)

---

## Conclusion

Your MOON website has excellent bones. By implementing the **Furnexa design pattern** (auto-rotating carousel + dynamic theming + transparent product images), you'll:

✅ Create a more **premium, engaging experience**  
✅ Improve **product discoverability**  
✅ Establish **brand continuity** across products  
✅ Provide **smooth, delightful animations**  
✅ Support **mobile-first design**  
✅ Enhance **accessibility**  

The transformation is **achievable in 3 weeks** with the implementation plan above.

---

**Document Version:** 1.0  
**Date:** April 2, 2026  
**Status:** ✅ Ready for Development  
**Estimated Implementation:** 3 weeks (3-4 developer days)

---

*This report provides a complete roadmap for transforming your MOON website into a best-in-class e-commerce experience inspired by modern design patterns.*
