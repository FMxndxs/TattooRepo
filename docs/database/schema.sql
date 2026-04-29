-- ============================================================
-- Imagination 3D — Supabase Schema
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- Extensoes
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIAS
-- ============================================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz default now()
);

-- ============================================================
-- PRODUTOS
-- ============================================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  print_time_minutes int,
  filament_grams numeric(6,2),
  price numeric(10,2) not null,
  is_available boolean default true,
  is_featured boolean default false,
  allows_custom_size boolean default false,
  allows_custom_color boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- IMAGENS DOS PRODUTOS
-- ============================================================
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt text,
  is_primary boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- CORES DISPONIVEIS
-- ============================================================
create table colors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  hex_code text not null,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- Cores x Produtos (quais cores estao disponiveis por produto)
create table product_colors (
  product_id uuid references products(id) on delete cascade,
  color_id uuid references colors(id) on delete cascade,
  is_available boolean default true,
  primary key (product_id, color_id)
);

-- ============================================================
-- TAMANHOS (opcional por produto)
-- ============================================================
create table product_sizes (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  label text not null,
  price_modifier numeric(10,2) default 0,
  is_available boolean default true
);

-- ============================================================
-- PEDIDOS PERSONALIZADOS
-- ============================================================
create table custom_orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_phone text not null,
  description text not null,
  reference_url text,
  reference_image_url text,
  status text default 'pending' check (status in ('pending','reviewing','quoted','accepted','rejected')),
  created_at timestamptz default now()
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table colors enable row level security;
alter table product_colors enable row level security;
alter table product_sizes enable row level security;
alter table custom_orders enable row level security;

-- Leitura publica para catalogo
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (is_available = true);
create policy "Public read product_images" on product_images for select using (true);
create policy "Public read colors" on colors for select using (true);
create policy "Public read product_colors" on product_colors for select using (true);
create policy "Public read product_sizes" on product_sizes for select using (true);

-- Insercao de pedidos personalizados (publico)
create policy "Public insert custom_orders" on custom_orders for insert with check (true);

-- Admin total (autenticado via Supabase Auth)
create policy "Admin all categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin all products" on products for all using (auth.role() = 'authenticated');
create policy "Admin all product_images" on product_images for all using (auth.role() = 'authenticated');
create policy "Admin all colors" on colors for all using (auth.role() = 'authenticated');
create policy "Admin all product_colors" on product_colors for all using (auth.role() = 'authenticated');
create policy "Admin all product_sizes" on product_sizes for all using (auth.role() = 'authenticated');
create policy "Admin read custom_orders" on custom_orders for select using (auth.role() = 'authenticated');

-- ============================================================
-- DADOS INICIAIS
-- ============================================================
insert into categories (name, slug, description, icon) values
  ('Decoracao', 'decoracao', 'Itens decorativos para casa e escritorio', 'Palette'),
  ('Utilitarios', 'utilitarios', 'Organizadores, suportes e acessorios do dia a dia', 'Package'),
  ('Escritorio', 'escritorio', 'Suportes para monitor, porta-caneta, organizadores', 'Briefcase'),
  ('Games', 'games', 'Acessorios e itens para gamers', 'Gamepad2'),
  ('Personalizados', 'personalizados', 'Sob encomenda conforme sua ideia', 'Sparkles');

insert into colors (name, hex_code) values
  ('Preto', '#1a1a1a'),
  ('Branco', '#f5f5f5'),
  ('Cinza', '#808080'),
  ('Vermelho', '#dc2626'),
  ('Azul', '#2563eb'),
  ('Verde', '#16a34a'),
  ('Amarelo', '#ca8a04'),
  ('Laranja', '#ea580c'),
  ('Rosa', '#db2777'),
  ('Roxo', '#9333ea');

-- ============================================================
-- TRIGGER: updated_at automatico
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();
