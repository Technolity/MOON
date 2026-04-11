insert into public.shipping_zones (
  zone_name,
  states,
  cost,
  estimated_days,
  is_active
)
values
  (
    'North',
    array['Delhi', 'Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir'],
    50.00,
    3,
    true
  ),
  (
    'South',
    array['Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Kerala'],
    60.00,
    4,
    true
  ),
  (
    'West',
    array['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan'],
    50.00,
    3,
    true
  ),
  (
    'East',
    array['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
    80.00,
    5,
    true
  ),
  (
    'Northeast',
    array['Assam', 'Manipur', 'Mizoram', 'Tripura', 'Nagaland', 'Meghalaya', 'Arunachal Pradesh', 'Sikkim'],
    100.00,
    7,
    true
  )
on conflict (zone_name) do update
set
  states = excluded.states,
  cost = excluded.cost,
  estimated_days = excluded.estimated_days,
  is_active = excluded.is_active,
  updated_at = timezone('utc', now());
