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
    'Shilajit',
    'shilajit',
    'Gold-grade Himalayan resin harvested above 4,000 metres. Rich in fulvic acid and trace minerals for focus, stamina, and recovery.',
    1999.00,
    null,
    'moon333/ezgif-frame-162.png',
    'wellness',
    'shilajit',
    'Shilajit | MOON',
    'Gold-grade Himalayan resin for focus, stamina, and recovery.'
  ),
  (
    'Kashmiri Saffron',
    'kashmiri-saffron',
    'Mongra A++ threads picked before sunrise in the Valley. The finest saffron Kashmir produces — for flavour, colour, and ritual.',
    1250.00,
    null,
    'moon2222/ezgif-frame-162.png',
    'wellness',
    'saffron',
    'Kashmiri Saffron | MOON',
    'Mongra A++ Kashmiri saffron for wellness rituals and culinary excellence.'
  ),
  (
    'Kashmiri Honey',
    'kashmiri-honey',
    'Wild mountain honey — raw and unfiltered from alpine Kashmir meadows. Deep floral notes with natural antibacterial properties.',
    1150.00,
    null,
    'ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
    'wellness',
    'honey',
    'Kashmiri Honey | MOON',
    'Raw unfiltered Kashmiri wild mountain honey with rich floral character.'
  ),
  (
    'Irani Saffron',
    'irani-saffron',
    'Irani Negin saffron — strong colour, balanced character. Premium Persian saffron for the discerning cook and wellness seeker.',
    1050.00,
    null,
    'ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
    'wellness',
    'honey',
    'Irani Saffron | MOON',
    'Premium Negin Irani saffron with rich colour and balanced aroma.'
  ),
  (
    'Kashmiri Almonds',
    'kashmiri-almonds',
    'Premium whole Kashmiri almond kernels — clean fats, natural vitamin E, orchard grown in the Valley.',
    899.00,
    null,
    'moon2222/ezgif-frame-162.png',
    'food',
    'honey',
    'Kashmiri Almonds | MOON',
    'Premium whole Kashmiri almonds — natural vitamin E and healthy fats.'
  ),
  (
    'Walnuts',
    'kashmiri-walnuts',
    'Kashmiri walnuts from Lolab orchards — omega-rich, fresh-crop, orchard select. Harvested at peak nutrition.',
    950.00,
    null,
    'moon333/ezgif-frame-162.png',
    'food',
    'honey',
    'Kashmiri Walnuts | MOON',
    'Omega-rich Kashmiri walnuts, fresh-crop orchard select from Lolab.'
  ),
  (
    'Kashmiri Ghee',
    'kashmiri-ghee',
    'Traditional bilona ghee from Bangus Valley — slow-churned, small-batch. The purest expression of mountain milk.',
    1350.00,
    null,
    'ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
    'wellness',
    'saffron',
    'Kashmiri Ghee | MOON',
    'Slow-churned traditional bilona ghee from Kashmiri mountain cows.'
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
    ('shilajit',         50, 'MOON-SHL-001'),
    ('kashmiri-saffron', 30, 'MOON-KSF-002'),
    ('kashmiri-honey',   25, 'MOON-KHN-007'),
    ('irani-saffron',    35, 'MOON-IRS-003'),
    ('kashmiri-almonds', 60, 'MOON-KAL-004'),
    ('kashmiri-walnuts', 45, 'MOON-WAL-005'),
    ('kashmiri-ghee',    20, 'MOON-KGH-006')
) as seeds(slug, quantity, sku)
join public.products products
  on products.slug = seeds.slug
on conflict (sku) do update
set
  product_id = excluded.product_id,
  quantity = excluded.quantity,
  reserved = excluded.reserved,
  updated_at = timezone('utc', now());
