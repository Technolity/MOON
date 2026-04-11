create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum (
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled'
);
create type public.payment_status as enum (
  'pending',
  'authorized',
  'captured',
  'failed',
  'refunded'
);
create type public.payment_method as enum (
  'upi',
  'card',
  'netbanking',
  'wallet',
  'unknown'
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  phone varchar(15),
  password_hash text,
  first_name varchar(100),
  last_name varchar(100),
  role public.user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  full_name varchar(120) not null,
  phone varchar(15) not null,
  line_1 varchar(255) not null,
  line_2 varchar(255),
  city varchar(120) not null,
  state varchar(120) not null,
  postal_code varchar(12) not null,
  country varchar(80) not null default 'India',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  slug citext not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  image_url text,
  category varchar(100) not null,
  theme varchar(50) not null,
  meta_title varchar(255),
  meta_description varchar(255),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  sku varchar(100) not null unique,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  order_number varchar(50) not null unique,
  status public.order_status not null default 'pending',
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  shipping_cost numeric(10, 2) not null default 0 check (shipping_cost >= 0),
  tax numeric(10, 2) not null default 0 check (tax >= 0),
  total numeric(10, 2) not null default 0 check (total >= 0),
  shipping_address_id uuid references public.addresses(id) on delete set null,
  billing_address_id uuid references public.addresses(id) on delete set null,
  tracking_number varchar(100),
  customer_email citext not null,
  customer_phone varchar(15) not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name varchar(255) not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  razorpay_order_id varchar(255) unique,
  razorpay_payment_id varchar(255) unique,
  razorpay_signature varchar(255),
  amount numeric(10, 2) not null default 0 check (amount >= 0),
  status public.payment_status not null default 'pending',
  method public.payment_method not null default 'unknown',
  provider varchar(50) not null default 'razorpay',
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  zone_name varchar(100) not null unique,
  states text[] not null default '{}'::text[],
  cost numeric(10, 2) not null default 0 check (cost >= 0),
  estimated_days integer not null check (estimated_days > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  event_type varchar(100) not null,
  properties jsonb not null default '{}'::jsonb,
  ip_address varchar(45),
  user_agent varchar(500),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_theme on public.products(theme);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_shipping_zones_active on public.shipping_zones(is_active);
create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at);
create index if not exists idx_analytics_events_event_type on public.analytics_events(event_type);
