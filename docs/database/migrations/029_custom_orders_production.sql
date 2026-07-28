-- Migration 029: Estende custom_orders para aceitar todos os estados de produção 3D
-- Permite que pedidos personalizados (custom_orders) entrem na fila de produção
-- após o cliente aceitar o orçamento (accepted → in_production).
-- Projeto Supabase: oflozudwutxgvwyvygll

-- Remove a constraint existente e recria com os novos valores
ALTER TABLE public.custom_orders
  DROP CONSTRAINT IF EXISTS custom_orders_status_check;

ALTER TABLE public.custom_orders
  ADD CONSTRAINT custom_orders_status_check
  CHECK (status IN (
    -- Ciclo de orçamento (exclusivo de custom_orders)
    'pending', 'reviewing', 'quoted', 'accepted', 'rejected',
    -- Ciclo de produção (compartilhado com orders)
    'in_production', 'finishing', 'ready',
    'out_for_delivery', 'shipped', 'delivered',
    -- Legacy / estados anteriores
    'completed', 'cancelled'
  ));
