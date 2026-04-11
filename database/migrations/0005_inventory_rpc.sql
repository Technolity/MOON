-- RPC used by the orders service to reserve inventory on order creation.
create or replace function public.increment_reserved(p_product_id uuid, p_quantity integer)
returns void
language plpgsql
as $$
begin
  update public.inventory
  set reserved = reserved + p_quantity
  where product_id = p_product_id
    and (quantity - reserved) >= p_quantity;

  if not found then
    raise exception 'Insufficient stock for product %', p_product_id
      using errcode = 'check_violation';
  end if;
end;
$$;
