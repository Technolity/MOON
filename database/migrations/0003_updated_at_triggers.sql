create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_users_set_updated_at on public.users;
create trigger trg_users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists trg_addresses_set_updated_at on public.addresses;
create trigger trg_addresses_set_updated_at
before update on public.addresses
for each row
execute function public.set_updated_at();

drop trigger if exists trg_products_set_updated_at on public.products;
create trigger trg_products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists trg_inventory_set_updated_at on public.inventory;
create trigger trg_inventory_set_updated_at
before update on public.inventory
for each row
execute function public.set_updated_at();

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists trg_payments_set_updated_at on public.payments;
create trigger trg_payments_set_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

drop trigger if exists trg_shipping_zones_set_updated_at on public.shipping_zones;
create trigger trg_shipping_zones_set_updated_at
before update on public.shipping_zones
for each row
execute function public.set_updated_at();
