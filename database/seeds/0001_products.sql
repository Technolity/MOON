insert into public.products (
  name,
  slug,
  description,
  price,
  discount_price,
  image_url,
  category,
  theme,
  meta_title,
  meta_description
)
values
  (
    'Kashmiri Saffron',
    'kashmiri-saffron',
    'Hand-selected Mongra A++ saffron sourced from Pampore for aroma, color, and daily ritual use.',
    850.00,
    null,
    'moon2222/ezgif-frame-120.jpg',
    'wellness',
    'saffron',
    'Kashmiri Saffron | MOON',
    'Premium Mongra A++ saffron for wellness rituals and culinary use.'
  ),
  (
    'Sidr Honey',
    'sidr-honey',
    'Raw Sidr honey with a deep caramel profile and rich daily wellness appeal.',
    1500.00,
    null,
    'ezgif-2fae6b36993927b6-jpg/ezgif-frame-118.jpg',
    'wellness',
    'honey',
    'Sidr Honey | MOON',
    'Pure Sidr honey curated for premium taste and everyday wellness.'
  ),
  (
    'Pure Shilajit',
    'pure-shilajit',
    'Purified Himalayan resin rich in fulvic acid and trace minerals.',
    1999.00,
    null,
    'moon333/ezgif-frame-125.jpg',
    'wellness',
    'shilajit',
    'Pure Shilajit | MOON',
    'High-potency Himalayan shilajit resin for focus, stamina, and recovery.'
  ),
  (
    'Premium Dates',
    'premium-dates',
    'Ajwa and Medjool dates curated as a premium daily nourishment option.',
    1200.00,
    null,
    'moon2222/ezgif-frame-056.jpg',
    'food',
    'saffron',
    'Premium Dates | MOON',
    'Curated Ajwa and Medjool dates for gifting and daily nourishment.'
  ),
  (
    'Traditional Kufa',
    'traditional-kufa',
    'Hand-knit cotton kufa designed for daily wear with a clean traditional finish.',
    499.00,
    null,
    'moon333/ezgif-frame-051.jpg',
    'apparel',
    'shilajit',
    'Traditional Kufa | MOON',
    'Traditional hand-knit kufa crafted for daily wear and gifting.'
  ),
  (
    'The Sunnah Box',
    'the-sunnah-box',
    'A curated ritual bundle that combines signature MOON products in one gift-ready box.',
    4500.00,
    null,
    'ezgif-2fae6b36993927b6-jpg/ezgif-frame-159.jpg',
    'bundle',
    'honey',
    'The Sunnah Box | MOON',
    'Gift-ready wellness bundle with premium signature MOON essentials.'
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  discount_price = excluded.discount_price,
  image_url = excluded.image_url,
  category = excluded.category,
  theme = excluded.theme,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  updated_at = timezone('utc', now());

insert into public.inventory (product_id, quantity, reserved, sku)
select
  products.id,
  seeds.quantity,
  0,
  seeds.sku
from (
  values
    ('kashmiri-saffron', 30, 'MOON-SAF-001'),
    ('sidr-honey', 20, 'MOON-HON-001'),
    ('pure-shilajit', 25, 'MOON-SHI-001'),
    ('premium-dates', 40, 'MOON-DAT-001'),
    ('traditional-kufa', 50, 'MOON-KUF-001'),
    ('the-sunnah-box', 15, 'MOON-BOX-001')
) as seeds(slug, quantity, sku)
join public.products products
  on products.slug = seeds.slug
on conflict (sku) do update
set
  product_id = excluded.product_id,
  quantity = excluded.quantity,
  reserved = excluded.reserved,
  updated_at = timezone('utc', now());
