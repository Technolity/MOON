# E-Commerce SaaS Dashboard Design Document

## 1. Overview & Objectives

This design document outlines the structure, visual language, and technical components required to build a modern, scalable E-commerce SaaS Dashboard. The primary objective is to provide a clean, user-friendly interface that allows businesses to manage orders, track sales, monitor inventory, and gain insightful analytics at a glance.

---

## 2. Visual Language & Theming

### Color Palette

The dashboard uses a minimal, high-contrast color scheme to maintain readability while using distinct accents for data visualization and actions.

| Color Name | Hex Code | Purpose |
|-----------|----------|---------|
| **Background** | `#F6F6F9` | Light gray/off-white for the main canvas to make white cards pop |
| **Primary Text & Headings** | `#343C46` | Dark charcoal for strong readability |
| **Secondary Text & Icons** | `#8F9EAC` and `#788998` | Muted cool grays for subtitles, placeholders, and inactive icons |
| **Primary Brand/Action Color** | `#5E67AA` | Soft Indigo/Purple for primary buttons, active states, and main chart lines |
| **Accent 1 (Highlights/Info)** | `#13ACE3` | Bright blue for secondary chart data or informational alerts |
| **Accent 2 (Warnings/Trends)** | `#DA7937` | Warm orange for alerts, low inventory warnings, or downward trends |

### Color Usage Guidelines

- **Primary Indigo (#5E67AA):** Main CTAs, active navigation states, primary chart lines
- **Bright Blue (#13ACE3):** Secondary data visualization, info tooltips
- **Warm Orange (#DA7937):** Declining metrics, alerts, warnings
- **Dark Gray (#343C46):** All primary text and headings
- **Muted Gray (#8F9EAC, #788998):** Disabled states, secondary information, icon fill
- **Light Background (#F6F6F9):** Main dashboard canvas
- **White (#FFFFFF):** Card backgrounds, primary content containers

### Typography

To match the modern, clean aesthetic:

**Font Family:** A geometric sans-serif like Inter, Plus Jakarta Sans, or Poppins.

**Font Weights:**
- **Regular (400):** Body text and table data
- **Medium (500):** Buttons and table headers
- **Semi-Bold (600):** Widget titles, numerical metrics, and page headings

**Font Scale (Recommended):**
- **Page Headings:** 28px - 32px (Semi-Bold)
- **Section Titles:** 20px - 24px (Semi-Bold)
- **Widget Titles:** 16px (Semi-Bold)
- **Body Text:** 14px (Regular)
- **Labels & Captions:** 12px (Medium)
- **Metric Values:** 32px - 48px (Semi-Bold)

---

## 3. Layout Structure

The application follows a classic, highly effective SaaS layout:

### Sidebar (Left)
- **Type:** Fixed navigation
- **Contents:** Links to key sections:
  - Dashboard (Home)
  - Orders
  - Inventory
  - Customers
  - Reports
  - Settings
- **Styling:** Active states highlighted using primary indigo color (#5E67AA)
- **Width:** 240px - 280px (collapsible on mobile)
- **Background:** White (#FFFFFF) with subtle border

### Top Header
- **Contents:**
  - Global search bar (centered or left-aligned)
  - Notification bell icon
  - User profile avatar/dropdown
- **Background:** White (#FFFFFF)
- **Height:** 60px - 70px
- **Sticky:** Yes (stays at top during scroll)
- **Box Shadow:** Subtle shadow-sm for depth

### Main Content Area
- **Type:** Scrollable container
- **Layout:** Grid-based modular layout (CSS Grid/Flexbox)
- **Grid Columns:** 12-column responsive grid (12 on desktop, 6 on tablet, 1 on mobile)
- **Padding:** 32px - 40px
- **Background:** #F6F6F9
- **Max Width:** No max-width constraint (full-bleed recommended for data-heavy dashboards)

### Responsive Breakpoints

```
Desktop:      1440px and above
Laptop:       1024px - 1440px
Tablet:       768px - 1024px
Mobile:       320px - 768px
```

---

## 4. Core UI Components & Modules

### A. Metric Summary Cards (Top Row)

**Purpose:** Provide at-a-glance KPI snapshots

**Elements:**
- Clean white cards with subtle drop shadow (`shadow-sm`)
- Card title/label (14px, Regular, #8F9EAC)
- Large metric value (36px - 48px, Semi-Bold, #343C46)
- Small icon (16px x 16px, #5E67AA)
- Percentage trend indicator (14px, Medium)
  - **Green (#10B981):** For upward trends
  - **Orange (#DA7937):** For downward trends
- Trend arrow icon (up/down)

**Layout:** Each card spans 3 columns (4 cards per row on desktop, 2 on tablet, 1 on mobile)

**Recommended Cards:**
1. Total Revenue (Current Period vs Previous)
2. Total Orders (Count with trend)
3. Average Order Value (with trend)
4. Conversion Rate (percentage with trend)

**Example Card Structure:**
```
┌─────────────────────────────────────┐
│  Total Revenue                   💰  │
│                                      │
│  $24,563                             │
│  ↑ 12.5%  (Green)                    │
└─────────────────────────────────────┘
```

---

### B. Sales & Revenue Analytics (Charts)

**Purpose:** Visualize sales trends and compare time periods

**Elements:**
- Large widget spanning 8 columns (desktop) or full width (mobile)
- Widget title: "Sales & Revenue" (20px, Semi-Bold, #343C46)
- Timeframe toggle buttons (Weekly, Monthly, Yearly)
  - **Active state:** Background #5E67AA, text white
  - **Inactive state:** Background transparent, text #8F9EAC
- Chart area with smooth animations

**Visualization:**
- **Chart Type:** Smooth line chart or curved area chart
- **Primary Line:** #5E67AA (current period)
- **Secondary Line/Fill:** #13ACE3 (comparison period or secondary metric)
- **Tooltip:** Custom tooltip on hover showing:
  - Date/time
  - Primary metric value
  - Secondary metric value
  - Difference/percentage change

**Interactive Features:**
- Hover states highlight data points
- Tooltips appear on hover
- Legend clickable to toggle data series
- Responsive: scales to container width

**Recommended Metrics to Display:**
- Current Week/Month Revenue vs Previous Week/Month
- Order Count Trends
- Customer Acquisition Rate

**Example Layout:**
```
┌─────────────────────────────────────────┐
│ Sales & Revenue                         │
│ [Weekly] [Monthly] [Yearly]             │
│                                         │
│        ↗ Current Period                 │
│       ╱                    ╲            │
│      ╱    ╱                  ╲          │
│     ╱    ╱        ╱            ╲        │
│    ╱    ╱        ╱              ╲      │
│   ╱____╱________╱________________╲__   │
│                                         │
│   Previous Period                       │
└─────────────────────────────────────────┘
```

---

### C. Order & Inventory Management (Data Tables)

**Purpose:** Display and manage orders/inventory with quick actions

**Elements:**
- Tabular layout with columns:
  - **Order ID** (or SKU for inventory)
  - **Date Created** (or Last Updated)
  - **Customer/Product Name**
  - **Amount/Quantity**
  - **Status**
  - **Actions** (three-dot menu)

**Column Headers:**
- 14px, Medium weight (#343C46)
- Sortable (click to sort ascending/descending)
- Sort icons appear on hover (#8F9EAC)
- Right-align numeric columns

**Row Styling:**
- White background
- Subtle border-bottom (#E5E7EB)
- Hover state: Light gray background (#F9FAFB)
- Height: 56px - 64px per row
- Padding: 16px (left/right)

**Status Badges:**
- **Type:** Pill-shaped badges with soft background colors
- **Styling:**
  - Background: Soft color (30% opacity of status color)
  - Text: Bold, dark version of status color
  - Padding: 6px 12px
  - Border Radius: 20px (fully rounded)
  - Font: 12px, Medium

**Status Examples:**
- **Pending:** Background #FEF3C7, Text #92400E
- **Delivered:** Background #DBEAFE, Text #0C4A6E
- **Cancelled:** Background #FEE2E2, Text #7F1D1D
- **Processing:** Background #E9D5FF, Text #6B21A8
- **Shipped:** Background #CCFBF1, Text #134E4A

**Action Menu (Three Dots):**
- Icon: 20px, #8F9EAC
- On hover: Change color to #5E67AA
- Click: Reveal dropdown with actions (View Details, Edit, Delete, etc.)

**Pagination:**
- Located at bottom of table
- Shows: "Page X of Y" and "Showing Z entries"
- Previous/Next buttons (disabled if at start/end)
- Rows per page dropdown (10, 25, 50, 100)

**Example Row:**
```
┌────────┬──────────┬──────────────┬────────┬──────────┬────────┐
│Order ID│   Date   │   Customer   │ Amount │  Status  │ Action │
├────────┼──────────┼──────────────┼────────┼──────────┼────────┤
│#12345  │ Feb 12   │ John Smith   │$523.00 │Delivered │  ⋯    │
│#12346  │ Feb 11   │ Jane Doe     │$231.50 │ Pending  │  ⋯    │
└────────┴──────────┴──────────────┴────────┴──────────┴────────┘
```

---

### D. Customer Insights

**Purpose:** Break down customer demographics or traffic sources

**Elements:**
- **Chart Type:** Circular progress rings or donut chart
- **Segments:** Different colored segments representing categories
- **Legend:** Clean legend below or beside chart
  - Segment name (14px, Regular, #343C46)
  - Percentage or count (14px, Medium, #8F9EAC)
  - Color indicator (12px circle)

**Layout Options:**

**Option 1: Donut Chart (Left) + Legend (Right)**
```
        ┌─────────────┐
        │  ╭─────╮    │  Legend:
        │  │ 42% │ 🔵 New Customers (42%)
        │  ╰─────╯    │ 🟢 Returning (28%)
        │    ╱╲       │ 🟡 At Risk (18%)
        │   ╱  ╲      │ 🟣 VIP (12%)
        └─────────────┘
```

**Option 2: Horizontal Stacked Bar**
```
New:      ████████░░░░░ 42% (520)
Returning:██████░░░░░░░ 28% (347)
At Risk:  █████░░░░░░░░ 18% (223)
VIP:      ███░░░░░░░░░░ 12% (149)
```

**Color Scheme for Customer Insights:**
- **New Customers:** #5E67AA (Primary)
- **Returning:** #10B981 (Green)
- **At Risk:** #DA7937 (Orange)
- **VIP:** #EC4899 (Pink/Magenta)

**Interactive Features:**
- Hover over segments to highlight and show tooltip
- Click legend items to toggle segment visibility
- Responsive: Stacks vertically on mobile

---

## 5. Recommended Tech Stack & Libraries

To execute this specific visual style natively and efficiently, the following libraries are recommended:

### Frontend Framework
- **React.js** or **Next.js** (SSR/SSG for better performance)
- Alternative: Vue.js (similar capabilities)

### Styling
- **Tailwind CSS** (utility-first CSS framework)
  - Perfect for precise hex codes
  - Subtle shadows (shadow-sm, shadow-md)
  - Rounded corners (rounded-xl, rounded-2xl)
  - Responsive design utilities
  - Easy theming with custom color palette

### UI Component Library
- **Shadcn UI** or **Radix UI**
  - Unstyled, accessible, and scalable modular components
  - Easily themed with exact Dribbble color palette
  - Includes: dropdowns, modals, dialogs, popovers, etc.
  - Built on Radix primitives (headless UI approach)

### Data Visualization (Charts)
- **Recharts** (recommended for React)
  - Responsive animated charts
  - Smooth area and line charts
  - Donut/pie charts
  - Custom tooltips and legends
  - Lightweight and performant
  
- Alternative: **Chart.js** (more flexible, steeper learning curve)

### Icons
- **Lucide Icons** or **Heroicons**
  - Clean, minimalist stroke-based icons
  - Match the secondary gray color (#8F9EAC) perfectly
  - Consistent sizing and weight
  - Extensive icon library

### Data Table Management
- **TanStack Table** (formerly React Table)
  - Handles sorting, filtering, pagination
  - Headless (bring your own UI)
  - Lightweight and powerful
  - Accessible by default
  - Perfect for complex order/inventory tables

### Additional Libraries
- **Framer Motion** (optional) - Smooth animations and transitions
- **Zustand** or **Redux Toolkit** - State management
- **Axios** - HTTP client for API calls
- **TypeScript** - Type safety

---

## 6. Component-Specific Implementation Notes

### A. Metric Cards Implementation

```jsx
// Component Structure
<MetricCard
  title="Total Revenue"
  value="$24,563"
  icon={DollarSign}
  trend={12.5}
  trendDirection="up"
  comparison="vs. previous period"
/>
```

**Styling with Tailwind:**
```tailwind
bg-white
rounded-xl
shadow-sm
p-6
border border-gray-100
```

---

### B. Chart Implementation

```jsx
// Using Recharts
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={chartData}>
    <defs>
      <linearGradient id="colorRevenue">
        <stop offset="0%" stopColor="#5E67AA" stopOpacity={0.3}/>
        <stop offset="100%" stopColor="#5E67AA" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
    <XAxis dataKey="name" stroke="#8F9EAC"/>
    <YAxis stroke="#8F9EAC"/>
    <Tooltip />
    <Area 
      type="monotone" 
      dataKey="revenue" 
      stroke="#5E67AA" 
      fillOpacity={1} 
      fill="url(#colorRevenue)"
    />
  </AreaChart>
</ResponsiveContainer>
```

---

### C. Data Table Implementation

```jsx
// Using TanStack Table + Shadcn UI
<DataTable
  columns={orderColumns}
  data={orders}
  sorting={true}
  filtering={true}
  pagination={true}
  rowsPerPage={10}
/>
```

**Column Definition Example:**
```jsx
const columns = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: (info) => `#${info.getValue()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />
  },
];
```

---

## 7. Responsive Design Specifications

### Desktop (1440px+)
- Sidebar: Always visible (280px)
- Main content: Full width with padding
- Grid: 12-column layout
- Metric cards: 4 per row
- Charts: Full width
- Tables: Horizontal scroll if needed

### Laptop (1024px - 1440px)
- Sidebar: Always visible (240px)
- Main content: Adjusted padding
- Grid: 12-column layout
- Metric cards: 2-4 per row
- Charts: Full width

### Tablet (768px - 1024px)
- Sidebar: Collapsible (hamburger menu)
- Main content: Full width when sidebar closed
- Grid: 6-column layout
- Metric cards: 2 per row
- Charts: Full width with horizontal scroll if needed
- Tables: Scrollable horizontally

### Mobile (320px - 768px)
- Sidebar: Drawer/slide-out menu
- Main content: Full width
- Grid: 1-column layout
- Metric cards: Stack vertically
- Charts: Full width, reduced height
- Tables: Card-based layout or horizontal scroll
- All padding reduced (16px - 20px)

---

## 8. Accessibility Requirements

- **Color Contrast:** All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Keyboard Navigation:** All interactive elements accessible via Tab key
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Focus States:** Clear, visible focus indicators (outline or highlight)
- **Icons:** All icons have text labels or aria-labels
- **Tables:** Proper header associations and ARIA roles
- **Form Fields:** Label associations and error messages

---

## 9. Animation & Interaction Guidelines

### Transitions
- **Standard Transition:** 200ms ease-in-out
- **Hover States:** 150ms
- **Page Load:** 300ms staggered animation for cards

### Hover States
- **Buttons:** Background color shift, subtle scale (1.02x)
- **Cards:** Elevation increase (shadow-md), 2px upward movement
- **Table Rows:** Light background color change (#F9FAFB)
- **Icons:** Color change to primary (#5E67AA)

### Loading States
- **Skeleton Screens:** Gray placeholder shimmer effect
- **Chart Loading:** Animated gradient placeholder
- **Table Loading:** Skeleton rows with pulsing animation

---

## 10. File Structure (React Project)

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── MetricCard.jsx
│   │   ├── SalesChart.jsx
│   │   ├── OrderTable.jsx
│   │   └── CustomerInsights.jsx
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── MainLayout.jsx
│   ├── Common/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Table.jsx
│   │   └── StatusBadge.jsx
│   └── Charts/
│       ├── AreaChart.jsx
│       ├── DonutChart.jsx
│       └── CustomTooltip.jsx
├── hooks/
│   ├── useMetrics.js
│   ├── useOrders.js
│   └── useChartData.js
├── styles/
│   ├── tailwind.css
│   ├── globals.css
│   └── animations.css
├── utils/
│   ├── formatters.js
│   ├── colorMap.js
│   └── constants.js
└── pages/
    ├── Dashboard.jsx
    └── NotFound.jsx
```

---

## 11. Color Variables (CSS/Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        dashboard: {
          bg: '#F6F6F9',
          text: '#343C46',
          'text-secondary': '#8F9EAC',
          'text-muted': '#788998',
          primary: '#5E67AA',
          accent: '#13ACE3',
          warning: '#DA7937',
          success: '#10B981',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'Poppins', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        '2xl': ['28px', '36px'],
        '3xl': ['32px', '40px'],
        '4xl': ['48px', '56px'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
```

---

## 12. Summary

This design system provides a comprehensive blueprint for building a modern, scalable E-commerce SaaS Dashboard. By following these specifications and utilizing the recommended tech stack (React, Tailwind CSS, Shadcn UI, Recharts, TanStack Table), you can create a professional, user-friendly dashboard that:

- ✅ Maintains visual consistency across all pages
- ✅ Provides excellent user experience with smooth interactions
- ✅ Supports responsive design across all devices
- ✅ Ensures accessibility for all users
- ✅ Scales efficiently as your product grows
- ✅ Supports dark mode implementation (in future phases)

---

**Document Version:** 1.0  
**Last Updated:** April 2, 2026  
**Status:** ✅ Ready for Implementation
