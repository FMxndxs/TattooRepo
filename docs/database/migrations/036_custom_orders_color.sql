-- Migration 036: Adiciona color_name em custom_orders
-- Projeto Supabase: oflozudwutxgvwyvygll
--
-- O formulário de pedido personalizado coletava color_name do cliente mas não
-- salvava no banco — apenas enviava via WhatsApp. Esta migration preserva o dado
-- para histórico e consulta no admin.

ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS color_name TEXT DEFAULT NULL;

COMMENT ON COLUMN public.custom_orders.color_name IS
  'Cor desejada pelo cliente para o pedido personalizado (snapshot do formulário)';
