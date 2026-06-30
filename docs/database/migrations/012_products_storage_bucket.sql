-- Migration 012: bucket de imagens para produtos
-- Rodar no SQL Editor do Supabase OU criar o bucket manualmente no dashboard.
--
-- ATENÇÃO: as funções storage.create_bucket e storage.policies são APIs internas
-- do Supabase. Prefira criar via dashboard (Storage → New bucket → "products",
-- marcar "Public") e depois adicionar as policies abaixo via SQL Editor.

-- 1. Criar bucket público (caso não exista)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- 2. Leitura pública (catálogo)
create policy "Leitura pública de imagens de produtos"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- 3. Upload autenticado (admin)
create policy "Upload de imagens de produtos por admin autenticado"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
  );

-- 4. Delete autenticado (admin)
create policy "Remoção de imagens de produtos por admin autenticado"
  on storage.objects for delete
  using (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
  );
