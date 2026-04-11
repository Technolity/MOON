create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  session_id text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists idx_carts_user_id
  on public.carts(user_id)
  where user_id is not null;

create index if not exists idx_carts_session_id
  on public.carts(session_id)
  where session_id is not null;
