-- Migration 027: Tabela order_status_history com trigger SECURITY DEFINER
-- Registra automaticamente cada mudança de status em orders e custom_orders.
-- Projeto Supabase: oflozudwutxgvwyvygll

-- 1. Tabela de histórico
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id   UUID        NOT NULL,
  subject_type TEXT        NOT NULL CHECK (subject_type IN ('order', 'custom')),
  status       TEXT        NOT NULL,
  changed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS order_status_history_subject_idx
  ON public.order_status_history(subject_id, subject_type);

CREATE INDEX IF NOT EXISTS order_status_history_changed_at_idx
  ON public.order_status_history(changed_at DESC);

-- 2. RLS
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Admin lê todo o histórico
CREATE POLICY "history_select_admin"
  ON public.order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Dono do pedido lê o próprio histórico
CREATE POLICY "history_select_own_order"
  ON public.order_status_history FOR SELECT
  USING (
    subject_type = 'order'
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_status_history.subject_id
        AND o.user_id = auth.uid()
    )
  );

-- Service role acesso total
CREATE POLICY "history_service_role_all"
  ON public.order_status_history FOR ALL
  USING (auth.role() = 'service_role');

-- 3. Função trigger SECURITY DEFINER (executa como o dono da função, não o chamador)
--    Isso garante que o trigger insere no histórico mesmo via RLS restritiva.
CREATE OR REPLACE FUNCTION record_order_status_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Só grava se o status realmente mudou
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history
      (subject_id, subject_type, status, changed_by)
    VALUES
      (NEW.id, TG_ARGV[0], NEW.status::TEXT, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Triggers em orders e custom_orders
CREATE OR REPLACE TRIGGER trg_orders_status_history
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION record_order_status_change('order');

CREATE OR REPLACE TRIGGER trg_custom_orders_status_history
  AFTER UPDATE OF status ON public.custom_orders
  FOR EACH ROW
  EXECUTE FUNCTION record_order_status_change('custom');

-- 5. Snapshot inicial: registra o status atual de todos os pedidos existentes
--    (como se fosse o primeiro evento de cada pedido)
INSERT INTO public.order_status_history (subject_id, subject_type, status, changed_at)
SELECT id, 'order', status::TEXT, created_at
FROM public.orders;

INSERT INTO public.order_status_history (subject_id, subject_type, status, changed_at)
SELECT id, 'custom', status, created_at
FROM public.custom_orders
WHERE status IS NOT NULL;
