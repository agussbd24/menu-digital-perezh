-- ============================================================
-- Menu Digital Perez H v3.0 - Schema
-- Ejecutar en Supabase SQL Editor
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- 1. TABLA DE USUARIOS DEL SISTEMA
-- ============================================================
create table if not exists public.system_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  display_name text not null,
  role text not null default 'kitchen' check (role in ('admin', 'kitchen')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.system_users enable row level security;

drop policy if exists "Allow anon login lookup" on public.system_users;
create policy "Allow anon login lookup"
on public.system_users
for select
to anon
using (true);

drop policy if exists "Allow anon user management" on public.system_users;
create policy "Allow anon user management"
on public.system_users
for all
to anon
using (true)
with check (true);

-- Admin usuario inicial (password: admin123, sha256 hash)
insert into public.system_users (username, password_hash, display_name, role)
values (
  'admin',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'Administrador',
  'admin'
)
on conflict (username) do nothing;

-- Kitchen usuario inicial (password: cocina123)
insert into public.system_users (username, password_hash, display_name, role)
values (
  'cocina',
  '17fb2b2ef0554390dfdcb2eb9099e1279e12bd4b4b01fb33a1d5f4c0ce15e85c',
  'Cocina',
  'kitchen'
)
on conflict (username) do nothing;

-- ============================================================
-- 2. TABLA DE PRODUCTOS
-- ============================================================
create table if not exists public.products (
  id text primary key,
  category text not null,
  name text not null,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  image text,
  badge text,
  available boolean not null default true,
  sort_order integer not null default 0,
  addons jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_available_idx on public.products (available);

alter table public.products enable row level security;

-- Allow public read of available products
drop policy if exists "Allow public product read" on public.products;
create policy "Allow public product read"
on public.products
for select
to anon
using (true);

-- Allow full anon access for admin operations (protected by app-level auth)
drop policy if exists "Allow full product access" on public.products;
create policy "Allow full product access"
on public.products
for all
to anon
using (true)
with check (true);

-- ============================================================
-- 3. TABLA DE CONFIGURACION DEL SITIO
-- ============================================================
create table if not exists public.site_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_config enable row level security;

drop policy if exists "Allow site config read" on public.site_config;
create policy "Allow site config read"
on public.site_config
for select
to anon
using (true);

drop policy if exists "Allow site config full access" on public.site_config;
create policy "Allow site config full access"
on public.site_config
for all
to anon
using (true)
with check (true);

-- Default config values
insert into public.site_config (key, value) values
('restaurant_name', '"Pérez H"'),
('tagline', '"La mejor hamburguesa en el país de la mejor carne."'),
('hero_description', '"Disponibilalo en nuestro menú digital"'),
('whatsapp_links', '[{"name":"PALERMO","url":"https://api.whatsapp.com/send/?phone=1136429912"},{"name":"MICROCENTRO","url":"https://api.whatsapp.com/send/?phone=5491144221293"}]'),
('delivery_links', '[{"name":"PEDIDOS YA","url":"https://www.pedidosya.com.ar/cadenas/perez-h"},{"name":"RAPPI","url":"https://www.rappi.com.ar/restaurantes/delivery/3451-perez-h"},{"name":"MERCADO PAGO","url":"https://www.mercadolibre.com.ar/landing/restaurantes"}]'),
('social_instagram', '"https://www.instagram.com/perez.hamburguesas/"'),
('social_tiktok', '"https://www.tiktok.com/@perez.hamburguesas"'),
('menu_url', '"https://menu-digital-perezh.pages.dev/menu"')
on conflict (key) do nothing;

-- ============================================================
-- 4. ORDERS (existente, sin cambios en RLS)
-- ============================================================
-- La tabla orders ya existe del schema original
