create extension if not exists citext;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code citext not null unique,
  type varchar(20) not null check (type in ('percent', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  minimum_subtotal numeric(10, 2) not null default 0 check (minimum_subtotal >= 0),
  max_discount numeric(10, 2) check (max_discount is null or max_discount >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_discount_codes_active on public.discount_codes(is_active);
create index if not exists idx_discount_codes_code on public.discount_codes(code);

drop trigger if exists trg_discount_codes_set_updated_at on public.discount_codes;
create trigger trg_discount_codes_set_updated_at
before update on public.discount_codes
for each row
execute function public.set_updated_at();
