-- Migration 006 — Adicionar 3 novas categorias
-- Execute no SQL Editor do Supabase Dashboard
-- Categorias existentes mantidas (Decoração, Utilitários, Escritório, Games, Personalizados)
-- Novas categorias expandem o catálogo para 8 no total

INSERT INTO categories (name, slug, description, icon, created_at)
VALUES
  ('Bonecos & Colecionáveis', 'bonecos',  'Articulados, action figures, miniaturas e colecionáveis impressos em 3D',   'toy',     now()),
  ('Maquiagem & Beleza',      'maquiagem', 'Organizadores de pincéis, suportes de batons, espelhos e acessórios de beleza', 'sparkles', now()),
  ('Brindes & Presentes',     'brindes',  'Lembrancinhas, marca-páginas, porta-chaves e presentes personalizados',       'gift',    now())
ON CONFLICT (slug) DO NOTHING;

-- Verificação: confirme que 8 categorias existem após executar
-- SELECT count(*) FROM categories;
