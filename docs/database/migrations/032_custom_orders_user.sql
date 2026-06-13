-- Migration 032: Vincula custom_orders ao user autenticado + restringe insert anônimo
-- Projeto Supabase: oflozudwutxgvwyvygll
--
-- Problema: a tabela custom_orders não tem user_id, o que permite que qualquer
-- visitante insira um pedido diretamente via anon key, contornando o gate de login.
-- Solução: adicionar user_id + trocar a policy de INSERT (pública → autenticada).

-- 1. Adiciona coluna user_id (nullable para preservar registros antigos)
ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Remove a policy de insert público
DROP POLICY IF EXISTS "Public insert custom_orders" ON public.custom_orders;

-- 3. Nova INSERT policy: só usuário autenticado inserindo o próprio user_id
CREATE POLICY "custom_orders_insert_own"
  ON public.custom_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. Nova SELECT policy para o dono ver seus próprios pedidos
--    (a policy admin_select_custom_orders via is_admin() já existe e permanece)
DROP POLICY IF EXISTS "custom_orders_select_own" ON public.custom_orders;
CREATE POLICY "custom_orders_select_own"
  ON public.custom_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Notas:
-- * Registros antigos (user_id NULL) ficam visíveis apenas ao admin (is_admin()).
-- * A policy de UPDATE (admin_update_custom_orders) e DELETE (admin_delete_custom_orders)
--   permanecem intactas.
-- * O trigger de order_code (trg_custom_orders_set_code) e o de status_history
--   continuam funcionando normalmente.
