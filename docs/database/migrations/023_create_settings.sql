-- Migration 023: tabela de configurações globais
-- Execute no SQL Editor do Supabase
-- Cria tabela `settings` de linha única para configurar o cálculo de frete:
--   hq_cep / hq_lat / hq_lng / hq_label  → local base da empresa
--   freight_per_km                         → R$ por km cobrado na entrega
--   delivery_radius_km                     → raio máximo (km) para entrega própria

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  hq_cep text,
  hq_lat double precision not null default -23.4442,
  hq_lng double precision not null default -46.9178,
  hq_label text default 'Santana de Parnaíba',
  freight_per_km numeric not null default 2.5,
  delivery_radius_km numeric not null default 8,
  updated_at timestamptz default now()
);

-- Seed com os valores históricos (sem sobrescrever se já existir)
insert into public.settings (id)
values (1)
on conflict (id) do nothing;

-- RLS
alter table public.settings enable row level security;

-- Leitura pública: o checkout (GET /api/freight) precisa ler sem estar logado
drop policy if exists "Public read settings" on public.settings;
create policy "Public read settings"
  on public.settings for select
  using (true);

-- Escrita restrita a admin (mesmo padrão de 020_admin_role.sql)
drop policy if exists "Admin write settings" on public.settings;
create policy "Admin write settings"
  on public.settings for all
  using (public.is_admin())
  with check (public.is_admin());
