# Landing Page Design Document

## 1. Overview & Objectives

This design document outlines the structure, visual language, and technical stack for an editorial-style, fashion e-commerce landing page. The design emphasizes a minimalist, "cinematic" shopping experience characterized by modular grids, bold typography, and a functional layout. The architecture is specifically designed to support a dynamic, three-tier thematic color system based on the showcased product.

The landing page serves as the primary entry point to the e-commerce platform, combining:
- **Editorial aesthetics** (high-fashion magazine style)
- **Functional e-commerce elements** (product discovery, cart functionality)
- **Dynamic theming** (color system adapts to featured product)
- **Cinematic imagery** (large-scale, full-bleed photography)
- **Smooth animations** (scroll-triggered reveals, transitions)

---

## 2. Visual Language & Dynamic Theming

### 2.1 Dynamic Color System (Product-Driven)

Instead of a static color palette, the application relies on **CSS Variables (Design Tokens)** to seamlessly switch between theme colors depending on the featured product or active category.

#### Design Token Architecture

**Base Variables (Root Level):**
```css
:root {
  /* Primary Theme Colors */
  --theme-primary: #000000;        /* Dominant product color */
  --theme-secondary: #FFFFFF;      /* Complementary color */
  --theme-accent: #E84C3D;          /* Highlight/CTA color */
  
  /* Text Colors */
  --text-primary: #000000;          /* Main text */
  --text-secondary: #666666;        /* Secondary text */
  --text-light: #999999;            /* Tertiary text */
  --text-inverse: #FFFFFF;          /* Text on dark backgrounds */
  
  /* Background Colors */
  --bg-primary: #FFFFFF;            /* Main background */
  --bg-secondary: #F5F5F5;          /* Secondary background */
  --bg-tertiary: #EFEFEF;           /* Tertiary background */
  
  /* Border & Divider */
  --border-color: #E0E0E0;          /* Subtle borders */
  --border-color-strong: #D0D0D0;   /* Stronger borders */
  
  /* Interactive */
  --hover-overlay: rgba(0, 0, 0, 0.05);    /* Hover state */
  --disabled-opacity: 0.5;                  /* Disabled elements */
}
```

#### Theme Switching Scenarios

**Theme 1: Dark Urban (Streetwear)**
```css
[data-theme="dark-urban"] {
  --theme-primary: #1a1a1a;
  --theme-secondary: #ffffff;
  --theme-accent: #ff6b35;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --bg-primary: #000000;
  --bg-secondary: #2a2a2a;
}
```

**Theme 2: Soft Minimalist (Luxury)**
```css
[data-theme="soft-minimalist"] {
  --theme-primary: #faf8f3;
  --theme-secondary: #2c2c2c;
  --theme-accent: #a67c52;
  --text-primary: #2c2c2c;
  --text-secondary: #666666;
  --bg-primary: #ffffff;
  --bg-secondary: #f5f3f0;
}
```

**Theme 3: Vibrant Contemporary (Bold)**
```css
[data-theme="vibrant"] {
  --theme-primary: #0a3d62;
  --theme-secondary: #ffd700;
  --theme-accent: #c0392b;
  --text-primary: #0a3d62;
  --text-secondary: #555555;
  --bg-primary: #ffffff;
  --bg-secondary: #f9f9f9;
}
```

#### Implementation with Tailwind CSS

Configure `tailwind.config.js` to use CSS variables:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--theme-primary)',
          secondary: 'var(--theme-secondary)',
          accent: 'var(--theme-accent)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          light: 'var(--text-light)',
          inverse: 'var(--text-inverse)',
        },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
          strong: 'var(--border-color-strong)',
        },
      },
      backgroundColor: {
        hover: 'var(--hover-overlay)',
      },
    },
  },
};
```

#### Theme Switching Implementation (React)

```jsx
// hooks/useTheme.js
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('dark-urban');

  const switchTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
    localStorage.setItem('preferredTheme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferredTheme') || 'dark-urban';
    switchTheme(savedTheme);
  }, []);

  return { theme, switchTheme };
};
```

---

### 2.2 Typography

#### Font Selection

**Headings Font (Bold, High-Impact):**
- **Primary Choice:** Syncopate, Monument Extended, or Clash Display
- **Purpose:** Create striking, editorial visual presence
- **Use Cases:**
  - Page titles
  - Section headers
  - Product names
  - Feature headlines
  - Call-to-action text

**Body Font (Clean, Readable):**
- **Primary Choice:** Inter, Helvetica Neue, or Segoe UI
- **Purpose:** Ensure readability for functional text
- **Use Cases:**
  - Product descriptions
  - Pricing information
  - Navigation labels
  - Form inputs
  - Footer text

#### Typography Scale

| Level | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| H1 | 48px - 64px | 700 (Bold) | 1.1 | Page hero title |
| H2 | 36px - 48px | 700 (Bold) | 1.2 | Section headers |
| H3 | 28px - 32px | 600 (Semi-Bold) | 1.3 | Subsection titles |
| H4 | 20px - 24px | 600 (Semi-Bold) | 1.4 | Card titles |
| Body Large | 18px | 400 (Regular) | 1.6 | Descriptive text |
| Body | 16px | 400 (Regular) | 1.5 | Default body text |
| Body Small | 14px | 400 (Regular) | 1.5 | Secondary info |
| Label | 12px | 500 (Medium) | 1.4 | Form labels, captions |
| Price | 20px - 28px | 700 (Bold) | 1 | Product pricing |

#### Typography CSS (Tailwind Classes)

```tailwind
/* Heading Styles */
.heading-h1 @apply text-5xl md:text-6xl font-bold leading-tight
.heading-h2 @apply text-4xl md:text-5xl font-bold leading-tight
.heading-h3 @apply text-2xl md:text-3xl font-semibold leading-relaxed
.heading-h4 @apply text-xl md:text-2xl font-semibold leading-relaxed

/* Body Styles */
.body-lg @apply text-lg font-normal leading-relaxed
.body @apply text-base font-normal leading-relaxed
.body-sm @apply text-sm font-normal leading-relaxed
.label @apply text-xs font-medium uppercase tracking-wide

/* Special Styles */
.price @apply text-2xl md:text-3xl font-bold leading-none
.marquee-text @apply text-5xl md:text-6xl lg:text-7xl font-bold
```

---

### 2.3 Imagery Style

#### Cinematic Photography Guidelines

**Image Characteristics:**
- **Scale:** Full-bleed, large-scale photography (minimum 800px width)
- **Aspect Ratios:**
  - Hero sections: 16:9 or 21:9 (ultra-wide cinematic)
  - Product cards: 1:1 (square) or 3:4 (portrait)
  - Banner sections: 16:9 or full-width variations
- **Composition:** 
  - Strong focal points
  - Negative space utilization
  - High contrast between subject and background
  - Professional product photography
- **Quality:** 
  - Minimum 2000px width
  - Optimized for web (WebP format with JPG fallback)
  - Professional color grading consistent with theme

#### Image Optimization Strategy

```jsx
// Next.js Image Optimization
import Image from 'next/image';

<Image
  src="/images/product-hero.jpg"
  alt="Product showcase"
  width={1920}
  height={1080}
  priority
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..." // LQIP
/>
```

---

## 3. Layout Structure

### 3.1 Overall Page Structure

The landing page is organized into distinct sections, each with specific visual and functional purposes:

```
┌─────────────────────────────────────────────┐
│  Navigation (Transparent/Sticky)            │
├─────────────────────────────────────────────┤
│  Hero Section (Animated, Pre-built)         │
├─────────────────────────────────────────────┤
│  Editorial Product Showcase (Grid)          │
├─────────────────────────────────────────────┤
│  Cinematic Scrolling Banner                 │
├─────────────────────────────────────────────┤
│  Product Grid (Modular Layout)              │
├─────────────────────────────────────────────┤
│  Featured Collection Section                │
├─────────────────────────────────────────────┤
│  Newsletter Signup Section                  │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

---

### 3.2 Navigation Bar

#### Structure & Styling

**Layout:**
- **Position:** Fixed at top, z-index: 100
- **Height:** 60px - 70px
- **Default State:** Transparent background (shows content below)
- **Scrolled State:** Solid or frosted glass background (backdrop-filter: blur)

**Components:**
```
┌─────────────────────────────────────────┐
│  LOGO      [SEARCH]      [CART] [USER]  │
└─────────────────────────────────────────┘
```

**Left Section:**
- Logo (30px x 30px or text-based)
- Logo is centered on mobile, left-aligned on desktop

**Center Section:**
- Search icon with dropdown/modal on click
- Keyboard shortcut indicator (Cmd+K or Ctrl+K)

**Right Section:**
- Cart icon (shows item count as badge)
- User account icon (links to login/profile)

#### CSS Implementation

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: transparent;
  transition: background 0.3s ease;
  z-index: 100;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  max-width: 1920px;
  margin: 0 auto;
}

.nav-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.nav-icon:hover {
  color: var(--theme-accent);
}

/* Badge for Cart Count */
.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--theme-accent);
  color: var(--text-inverse);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}
```

---

### 3.3 Hero Section (Pre-built & Animated)

#### Reserved Implementation Area

```jsx
// pages/index.jsx
import HeroSection from '@/components/HeroSection';
import EditorialShowcase from '@/components/EditorialShowcase';

export default function Home() {
  return (
    <main>
      {/* 
        Your pre-built animated hero section mounts here
        This component includes all animations from your HTML
      */}
      <HeroSection />
      
      {/* Rest of the page layout below */}
      <EditorialShowcase />
      {/* ... other sections ... */}
    </main>
  );
}
```

#### Hero Wrapper Styling

```css
/* Reserve space for hero animation */
.hero-section {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
  margin-top: 70px; /* Account for fixed navbar */
}

/* Ensure smooth transition to next section */
.hero-section + section {
  margin-top: 0;
}
```

---

### 3.4 Editorial Product Showcase (Modular Grid)

#### Grid Architecture

The showcase uses an **asymmetric grid** inspired by high-end fashion magazines:

```
┌─────────────────┬─────────┐
│                 │ Product │
│ Large Feature   ├─────────┤
│ Image (2 rows)  │ Product │
│                 │ Card 2  │
├─────────────────┼─────────┤
│ Product Card 1  │ Product │
├─────────────────┤ Card 3  │
│ Product Card 2  │         │
└─────────────────┴─────────┘
```

#### Grid CSS (Using CSS Grid)

```css
.editorial-showcase {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  padding: 60px 24px;
  max-width: 1920px;
  margin: 0 auto;
}

/* Large Feature Image (Left Side) */
.showcase-featured {
  grid-column: 1 / 7;  /* Spans 6 columns */
  grid-row: 1 / 3;     /* Spans 2 rows */
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 4px;
}

.showcase-featured img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.showcase-featured:hover img {
  transform: scale(1.05);
}

/* Product Cards (Right Side) */
.showcase-card {
  grid-column: 7 / 13;  /* Spans 6 columns */
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
}

.showcase-card:nth-child(2) {
  grid-row: 1;
}

.showcase-card:nth-child(3) {
  grid-row: 2;
}

.showcase-card:nth-child(4) {
  grid-row: 3;
}

/* Responsive: Collapse on tablet/mobile */
@media (max-width: 1024px) {
  .editorial-showcase {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .showcase-featured,
  .showcase-card {
    grid-column: 1 / 7;
  }
}

@media (max-width: 640px) {
  .editorial-showcase {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .showcase-featured,
  .showcase-card {
    grid-column: 1;
  }
}
```

---

### 3.5 Cinematic Scrolling Banner

#### Design & Functionality

A full-width section with a large scrolling marquee text overlaid on lifestyle imagery.

**Example:** `NEW ARRIVALS • FALL COLLECTION • EXCLUSIVE DROPS`

#### HTML Structure

```html
<section class="scrolling-banner">
  <div class="banner-background">
    <img src="/images/banner-lifestyle.jpg" alt="Banner" />
  </div>
  
  <div class="banner-marquee">
    <div class="marquee-track">
      <span>NEW ARRIVALS • FALL COLLECTION • EXCLUSIVE DROPS • </span>
      <span>NEW ARRIVALS • FALL COLLECTION • EXCLUSIVE DROPS • </span>
    </div>
  </div>
  
  <div class="banner-overlay"></div>
</section>
```

#### CSS Implementation (Marquee Animation)

```css
.scrolling-banner {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 80px 0;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Semi-transparent overlay for text readability */
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 2;
}

/* Marquee Text Container */
.banner-marquee {
  position: relative;
  z-index: 3;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-track {
  display: flex;
  animation: marquee 20s linear infinite;
  font-size: 64px;
  font-weight: 700;
  color: var(--text-inverse);
  text-transform: uppercase;
  letter-spacing: 2px;
  will-change: transform;
}

.marquee-track span {
  padding-right: 20px;
  flex-shrink: 0;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Pause on hover */
.scrolling-banner:hover .marquee-track {
  animation-play-state: paused;
}

/* Responsive */
@media (max-width: 768px) {
  .scrolling-banner {
    height: 250px;
  }
  
  .marquee-track {
    font-size: 36px;
  }
}
```

#### GSAP Alternative Implementation

```javascript
// components/ScrollingBanner.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ScrollingBanner() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const marqueeContent = marquee.querySelector('.marquee-track');
    
    // Clone the content for seamless loop
    const clone = marqueeContent.cloneNode(true);
    marquee.appendChild(clone);

    // Animate with GSAP
    gsap.to('.marquee-track', {
      xPercent: -100,
      repeat: -1,
      duration: 20,
      ease: 'none',
    });
  }, []);

  return (
    <section className="scrolling-banner" ref={marqueeRef}>
      <div className="banner-background">
        <img src="/images/banner-lifestyle.jpg" alt="Banner" />
      </div>
      <div className="banner-marquee">
        <div className="marquee-track">
          <span>NEW ARRIVALS • FALL COLLECTION • EXCLUSIVE DROPS • </span>
        </div>
      </div>
      <div className="banner-overlay"></div>
    </section>
  );
}
```

---

### 3.6 Product Grid (Modular Layout)

#### Grid Variations

The product grid uses alternating layouts to maintain visual interest:

**Layout Option 1: 3+1 Grid**
```
┌─────┬─────┬─────┐
│ Lg  │ Sm  │ Sm  │
│ Img │ Img │ Img │
├─────┼─────┼─────┤
│ Sm  │ Sm  │  Lg │
│ Img │ Img │ Img │
├─────┴─────┼─────┤
│    Lg     │ Sm  │
│    Img    │ Img │
└───────────┴─────┘
```

**Layout Option 2: Uniform 4-Column**
```
┌─────┬─────┬─────┬─────┐
│ Img │ Img │ Img │ Img │
├─────┼─────┼─────┼─────┤
│ Img │ Img │ Img │ Img │
└─────┴─────┴─────┴─────┘
```

#### CSS Grid Implementation

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 80px 24px;
  max-width: 1920px;
  margin: 0 auto;
}

/* Featured Product (Larger) */
.product-card.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.product-card.featured img {
  aspect-ratio: 1 / 1;
}

/* Standard Product Card */
.product-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--bg-secondary);
  margin-bottom: 12px;
  position: relative;
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-card-image img {
  transform: scale(1.08);
}

/* Product Info */
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.product-add-btn {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid var(--text-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

.product-add-btn:hover {
  background: var(--text-primary);
  color: var(--bg-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 40px 12px;
  }
  
  .product-card.featured {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

---

### 3.7 Featured Collection Section

A dedicated section highlighting a curated collection with descriptive copy and a CTA.

```html
<section class="featured-collection">
  <div class="collection-content">
    <div class="collection-text">
      <h2 class="heading-h2">Curated for You</h2>
      <p class="body-lg">
        Discover our hand-picked selection of essentials for the season.
        Carefully curated to reflect the latest trends and timeless pieces.
      </p>
      <button class="cta-button">Browse Collection</button>
    </div>
    
    <div class="collection-image">
      <img src="/images/collection.jpg" alt="Featured collection" />
    </div>
  </div>
</section>
```

#### CSS for Featured Collection

```css
.featured-collection {
  padding: 80px 24px;
  background: var(--bg-secondary);
  margin: 60px 0;
}

.collection-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1920px;
  margin: 0 auto;
  align-items: center;
}

.collection-text h2 {
  margin-bottom: 24px;
}

.collection-text p {
  margin-bottom: 32px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.collection-image {
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 4px;
}

.collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive */
@media (max-width: 768px) {
  .collection-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .featured-collection {
    padding: 40px 12px;
    margin: 30px 0;
  }
}
```

---

### 3.8 Newsletter Signup Section

A minimal, functional section for email subscription:

```html
<section class="newsletter-section">
  <div class="newsletter-content">
    <h3 class="heading-h3">Stay Updated</h3>
    <p class="body">Get early access to new collections and exclusive offers.</p>
    
    <form class="newsletter-form" onSubmit={handleSubscribe}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        required 
        className="newsletter-input"
      />
      <button type="submit" class="newsletter-button">Subscribe</button>
    </form>
  </div>
</section>
```

#### CSS for Newsletter

```css
.newsletter-section {
  padding: 80px 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.newsletter-content h3 {
  margin-bottom: 16px;
}

.newsletter-content p {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.newsletter-input::placeholder {
  color: var(--text-light);
}

.newsletter-input:focus {
  border-color: var(--theme-accent);
}

.newsletter-button {
  padding: 12px 24px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

.newsletter-button:hover {
  background: var(--theme-accent);
  color: var(--text-inverse);
}

/* Responsive */
@media (max-width: 640px) {
  .newsletter-form {
    flex-direction: column;
  }
  
  .newsletter-button {
    width: 100%;
  }
}
```

---

### 3.9 Footer

A clean, minimalist footer with functional links and social media.

```html
<footer class="footer">
  <div class="footer-content">
    <!-- Links Column -->
    <div class="footer-column">
      <h4 class="footer-title">Shop</h4>
      <ul class="footer-links">
        <li><a href="#new">New Arrivals</a></li>
        <li><a href="#men">Men</a></li>
        <li><a href="#women">Women</a></li>
        <li><a href="#sale">Sale</a></li>
      </ul>
    </div>
    
    <div class="footer-column">
      <h4 class="footer-title">Help</h4>
      <ul class="footer-links">
        <li><a href="#contact">Contact</a></li>
        <li><a href="#shipping">Shipping</a></li>
        <li><a href="#returns">Returns</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
    </div>
    
    <div class="footer-column">
      <h4 class="footer-title">Company</h4>
      <ul class="footer-links">
        <li><a href="#about">About Us</a></li>
        <li><a href="#privacy">Privacy</a></li>
        <li><a href="#terms">Terms</a></li>
        <li><a href="#careers">Careers</a></li>
      </ul>
    </div>
    
    <!-- Social Links -->
    <div class="footer-column">
      <h4 class="footer-title">Follow</h4>
      <ul class="footer-links footer-social">
        <li><a href="#instagram">Instagram</a></li>
        <li><a href="#twitter">Twitter</a></li>
        <li><a href="#tiktok">TikTok</a></li>
      </ul>
    </div>
  </div>
  
  <div class="footer-bottom">
    <p class="footer-copyright">© 2024 Brand Name. All rights reserved.</p>
  </div>
</footer>
```

#### CSS for Footer

```css
.footer {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 60px 24px 30px;
  margin-top: 100px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
  max-width: 1920px;
  margin: 0 auto 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--theme-accent);
}

/* Social Links */
.footer-social {
  flex-direction: row;
  gap: 20px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid var(--border-color);
}

.footer-copyright {
  font-size: 12px;
  color: var(--text-light);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .footer {
    padding: 40px 12px 20px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
```

---

## 4. Core UI Components

### 4.1 Product Cards

#### Card Structure

```jsx
<div className="product-card">
  <div className="product-card-image">
    <img src={product.image} alt={product.name} />
  </div>
  <div className="product-info">
    <h4 className="product-name">{product.name}</h4>
    <p className="product-description">{product.category}</p>
    <div className="product-footer">
      <span className="product-price">${product.price}</span>
      <button className="product-add-btn">Add to Cart</button>
    </div>
  </div>
</div>
```

#### Interactive States

**Hover State:**
- Image scales up (1.08x)
- Button background fills
- Subtle shadow increase

**Active/Focus State:**
- Border highlight with theme accent color
- Button text color inverts

---

### 4.2 Buttons

#### Button Variants

**Primary Button (CTA)**
```css
.btn-primary {
  background: var(--text-primary);
  color: var(--bg-primary);
  border: 1px solid var(--text-primary);
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 0;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--theme-accent);
  border-color: var(--theme-accent);
  color: var(--text-inverse);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

**Secondary Button (Ghost)**
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 0;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--text-primary);
}
```

#### Button Sizing

| Size | Padding | Font Size |
|------|---------|-----------|
| Small | 8px 16px | 12px |
| Medium | 12px 24px | 14px |
| Large | 16px 32px | 16px |

---

### 4.3 Grid Lines & Borders

Subtle 1px borders are used throughout to create the architectural aesthetic:

```css
/* Subtle dividers */
.divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 40px 0;
}

/* Grid borders */
.grid-item {
  border: 1px solid var(--border-color);
}

/* Strong dividers (section separators) */
.divider-strong {
  border-top: 1px solid var(--border-color-strong);
}
```

---

## 5. Recommended Tech Stack & Libraries

### 5.1 Frontend Framework

**Next.js (Recommended)**
- Built-in image optimization (next/image)
- Server-side rendering (SSR) for SEO
- Static site generation (SSG) for performance
- API routes for backend integration
- Excellent developer experience

**Alternative:** Nuxt.js (Vue.js-based, similar benefits)

```bash
# Create Next.js project
npx create-next-app@latest landing --typescript --tailwind

# Install additional dependencies
npm install gsap framer-motion zustand
```

### 5.2 Styling & Theming

**Tailwind CSS (with CSS Variables)**

Already configured with design tokens (see Section 2.1)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**PostCSS Configuration for CSS Variables:**
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 5.3 UI Components & Accessibility

**Radix UI** (Headless, accessible components)
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

**Headless UI** (Alternative, built by Tailwind Labs)
```bash
npm install @headlessui/react
```

#### Example: Dropdown Menu with Radix UI

```jsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function CartDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="nav-icon" aria-label="Cart">
          🛒
        </button>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Content>
        {/* Cart items */}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
```

### 5.4 Scroll Animations & Transitions

**GSAP (GreenSock Animation Platform)**
- Professional-grade animation library
- Perfect for cinematic scroll effects
- Large ecosystem and community

```bash
npm install gsap
```

**Framer Motion** (Alternative, React-native)
```bash
npm install framer-motion
```

#### GSAP Scroll Trigger Example

```jsx
import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollAnimation() {
  useEffect(() => {
    // Animate on scroll
    gsap.to('.product-card', {
      scrollTrigger: {
        trigger: '.product-grid',
        start: 'top 80%',
        end: 'bottom 20%',
      },
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
    });
  }, []);

  return <div className="product-grid">...</div>;
}
```

### 5.5 State Management (Theme Management)

**Zustand** (Lightweight, minimal boilerplate)

```bash
npm install zustand
```

```javascript
// stores/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark-urban',
      switchTheme: (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
```

**React Context** (Built-in, if you prefer)

```jsx
// context/ThemeContext.jsx
import { createContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark-urban');

  const switchTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 5.6 Additional Libraries

| Library | Purpose | Install |
|---------|---------|---------|
| **Lucide Icons** | Minimalist icons | `npm install lucide-react` |
| **clsx** | Conditional classnames | `npm install clsx` |
| **date-fns** | Date formatting | `npm install date-fns` |
| **react-hook-form** | Form management | `npm install react-hook-form` |
| **swr** | Data fetching | `npm install swr` |

---

## 6. Project Structure

```
landing-page/
├── public/
│   ├── images/
│   │   ├── hero-*.jpg
│   │   ├── product-*.jpg
│   │   └── banner-*.jpg
│   └── icons/
│       └── svg-icons/
│
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   │   ├── Navbar.jsx
│   │   │   ├── NavSearch.jsx
│   │   │   └── Navbar.module.css
│   │   │
│   │   ├── Hero/
│   │   │   ├── HeroSection.jsx  // Your pre-built animated hero
│   │   │   └── HeroSection.module.css
│   │   │
│   │   ├── ProductShowcase/
│   │   │   ├── EditorialShowcase.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductShowcase.module.css
│   │   │
│   │   ├── Sections/
│   │   │   ├── ScrollingBanner.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── FeaturedCollection.jsx
│   │   │   ├── Newsletter.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Image.jsx
│   │
│   ├── hooks/
│   │   ├── useTheme.js
│   │   ├── useScroll.js
│   │   └── useIntersectionObserver.js
│   │
│   ├── stores/
│   │   ├── themeStore.js
│   │   └── cartStore.js
│   │
│   ├── utils/
│   │   ├── cn.js          // Classname utility
│   │   ├── formatPrice.js
│   │   └── constants.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css  // CSS custom properties
│   │   └── animations.css
│   │
│   ├── pages/
│   │   ├── index.jsx      // Home/Landing page
│   │   ├── _app.jsx
│   │   ├── _document.jsx
│   │   └── api/           // API routes if needed
│   │
│   └── config/
│       ├── products.json  // Mock product data
│       └── theme.json     // Theme definitions
│
├── tailwind.config.js
├── next.config.js
├── package.json
└── README.md
```

---

## 7. Responsive Breakpoints

### Desktop-First Approach

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile
      'md': '768px',   // Tablet
      'lg': '1024px',  // Small laptop
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
    },
  },
};
```

### Responsive Pattern

```jsx
// Example component with responsive layout
<div className="
  grid grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-4 md:gap-6 lg:gap-8
">
  {/* Grid items */}
</div>
```

---

## 8. Performance Optimization

### Image Optimization

```jsx
import Image from 'next/image';

<Image
  src="/images/product.jpg"
  alt="Product"
  width={800}
  height={800}
  priority={false}
  loading="lazy"
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..." // LQIP
/>
```

### Code Splitting

```javascript
// next.config.js
module.exports = {
  compress: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['your-image-cdn.com'],
  },
};
```

### Lazy Loading Components

```jsx
import dynamic from 'next/dynamic';

const FeaturedCollection = dynamic(
  () => import('@/components/FeaturedCollection'),
  { loading: () => <div>Loading...</div> }
);
```

---

## 9. Accessibility Checklist

- ✅ Semantic HTML (header, nav, main, footer, section, article)
- ✅ ARIA labels for interactive elements
- ✅ Color contrast (WCAG AA minimum)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus visible states (outline or highlight)
- ✅ Image alt text
- ✅ Form labels and error messages
- ✅ Skip links for keyboard users
- ✅ Screen reader testing
- ✅ Mobile accessibility (touch targets min 48px)

---

## 10. SEO Optimization

### Meta Tags

```jsx
// pages/index.jsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Premium Fashion Collection | Brand Name</title>
        <meta name="description" content="Shop our curated collection of fashion essentials." />
        <meta property="og:title" content="Premium Fashion Collection" />
        <meta property="og:description" content="..." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Page content */}
    </>
  );
}
```

### Structured Data (Schema.org)

```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'Brand Name',
      url: 'https://example.com',
      // ... more schema data
    }),
  }}
/>
```

---

## 11. Animation Guidelines

### Hover Animations

```css
/* Button hover */
.cta-button {
  transition: all 0.2s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Image zoom */
.product-card img {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover img {
  transform: scale(1.08);
}
```

### Scroll Animations (GSAP)

```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to('.animate-on-scroll', {
  scrollTrigger: {
    trigger: '.animate-on-scroll',
    start: 'top 80%',
    end: 'bottom 20%',
    markers: false,
  },
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
});
```

---

## 12. Testing Strategy

### Unit Testing (Jest + React Testing Library)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### E2E Testing (Cypress)

```bash
npm install --save-dev cypress
npx cypress open
```

### Lighthouse Performance Testing

```bash
# Build and analyze
npm run build
npx lighthouse https://localhost:3000 --chrome-flags="--headless"
```

---

## 13. Deployment

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=UA-xxxxx
```

---

## 14. Summary & Implementation Checklist

### Phase 1: Setup & Foundation
- [ ] Initialize Next.js project
- [ ] Configure Tailwind CSS with design tokens
- [ ] Set up project structure
- [ ] Create theme system (Zustand/Context)

### Phase 2: Core Components
- [ ] Build Navigation bar
- [ ] Implement Hero section wrapper
- [ ] Create Product card component
- [ ] Build button variations

### Phase 3: Sections
- [ ] Editorial product showcase
- [ ] Scrolling banner
- [ ] Product grid
- [ ] Featured collection
- [ ] Newsletter signup
- [ ] Footer

### Phase 4: Animations & Interactions
- [ ] Implement GSAP scroll triggers
- [ ] Add hover animations
- [ ] Smooth page transitions
- [ ] Marquee text animation

### Phase 5: Optimization & Testing
- [ ] Image optimization
- [ ] Code splitting
- [ ] Performance testing (Lighthouse)
- [ ] Accessibility audit
- [ ] SEO implementation

### Phase 6: Deployment
- [ ] Configure environment variables
- [ ] Deploy to Vercel
- [ ] Set up monitoring
- [ ] Analytics integration

---

## 15. References & Inspiration

- **Design Reference:** [Sidewalk Fashion E-Commerce Template](https://dribbble.com/shots/27026833-Sidewalk-Fashion-E-Commerce-Website)
- **Documentation:**
  - [Next.js Docs](https://nextjs.org/docs)
  - [Tailwind CSS Docs](https://tailwindcss.com/docs)
  - [GSAP Docs](https://greensock.com/docs)
  - [Radix UI Docs](https://www.radix-ui.com/docs)
- **Tools:**
  - [Figma](https://figma.com) - Design mockups
  - [ImageOptim](https://imageoptim.com) - Image compression
  - [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Performance

---

**Document Version:** 1.0  
**Last Updated:** April 2, 2026  
**Status:** ✅ Ready for Implementation  
**Design Reference:** Sidewalk Fashion E-Commerce (Dribbble)

---

*This landing page design prioritizes visual impact, user experience, and performance. By following this specification and utilizing the recommended tech stack, you'll create a modern, scalable, and accessible e-commerce landing page that drives user engagement and conversions.*
