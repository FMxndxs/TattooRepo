-- Migration 025: Adiciona fulfillment_type, courier_name e tracking_code em orders
-- Projeto Supabase: oflozudwutxgvwyvygll

-- 1. Tipo de atendimento
DO $$ BEGIN
  CREATE TYPE fulfillment_type AS ENUM ('delivery', 'shipping', 'pickup');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Novas colunas na tabela orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS fulfillment_type fulfillment_type DEFAULT 'pickup',
  ADD COLUMN IF NOT EXISTS courier_name     TEXT            DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tracking_code    TEXT            DEFAULT NULL;

COMMENT ON COLUMN public.orders.fulfillment_type IS
  'Modalidade de entrega: delivery (raio 8km) | shipping (correios) | pickup (retirada)';
COMMENT ON COLUMN public.orders.courier_name IS
  'Nome do entregador capturado no despacho (apenas delivery)';
COMMENT ON COLUMN public.orders.tracking_code IS
  'Código de rastreamento capturado no envio (apenas shipping)';
