create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  table_number text not null,
  customer_name text,
  items jsonb not null default '[]'::jsonb,
  total numeric(12, 2) not null check (total >= 0),
  notes text,
  status text not null default 'new' check (status in ('new', 'preparing', 'ready', 'delivered')),
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_table_number_idx on public.orders (table_number);

alter table public.orders enable row level security;

drop policy if exists "Allow public order creation" on public.orders;
create policy "Allow public order creation"
on public.orders
for insert
to anon
with check (
  table_number <> ''
  and jsonb_typeof(items) = 'array'
  and jsonb_array_length(items) > 0
  and total >= 0
  and status = 'new'
);

drop policy if exists "Allow kitchen order read" on public.orders;
create policy "Allow kitchen order read"
on public.orders
for select
to anon
using (true);

drop policy if exists "Allow kitchen status updates" on public.orders;
create policy "Allow kitchen status updates"
on public.orders
for update
to anon
using (true)
with check (
  status in ('new', 'preparing', 'ready', 'delivered')
);

do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  )
  and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;
