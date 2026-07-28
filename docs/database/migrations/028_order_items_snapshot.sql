-- Migration 028: Colunas de snapshot em order_items
-- Preserva nome do produto, cor e tamanho mesmo após edições/exclusões do catálogo.
-- Usadas pelos relatórios de produtos mais vendidos.
-- Projeto Supabase: oflozudwutxgvwyvygll

-- 1. Adicionar colunas de snapshot
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS product_name TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS color_name   TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS size_label   TEXT DEFAULT NULL;

COMMENT ON COLUMN public.order_items.product_name IS
  'Snapshot do nome do produto no momento da compra';
COMMENT ON COLUMN public.order_items.color_name IS
  'Snapshot do nome da cor selecionada';
COMMENT ON COLUMN public.order_items.size_label IS
  'Snapshot do label do tamanho selecionado';

-- 2. Backfill para registros existentes
-- color_name e size_label usam subquery porque LEFT JOIN na tabela-alvo
-- não pode referenciar o alias dela nos ON clauses do FROM.
UPDATE public.order_items oi
SET
  product_name = p.name,
  color_name   = (SELECT c.name  FROM public.colors        c  WHERE c.id  = oi.color_id),
  size_label   = (SELECT ps.label FROM public.product_sizes ps WHERE ps.id = oi.size_id)
FROM public.products p
WHERE p.id = oi.product_id
  AND oi.product_name IS NULL;
