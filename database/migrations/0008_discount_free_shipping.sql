alter table public.discount_codes
  add column if not exists free_shipping boolean not null default false;

comment on column public.discount_codes.free_shipping is
  'When true, applying this discount waives the shipping charge entirely.';
