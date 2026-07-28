-- Migration 037: Função RPC para criação atômica de pedido + itens
-- Projeto Supabase: oflozudwutxgvwyvygll
--
-- Problema: a criação de pedido era feita em dois passos (INSERT orders, depois
-- INSERT order_items) sem atomicidade. Se o segundo INSERT falhasse, ficava um
-- pedido órfão (header sem itens).
--
-- Solução: função SECURITY DEFINER que executa ambos os INSERTs em uma única
-- transação implícita. O total é calculado pelo servidor (server action) e
-- passado como parâmetro — não é mais confiado ao cliente.
--
-- Acesso: authenticated role apenas (não anon). A server action já valida o
-- user_id via supabase.auth.getUser() antes de chamar esta função.

CREATE OR REPLACE FUNCTION public.create_order_atomic(
  p_user_id        uuid,
  p_total          numeric,
  p_freight        numeric,
  p_fulfillment_type text,
  p_cep            text,
  p_street         text,
  p_street_number  text,
  p_neighborhood   text,
  p_city           text,
  p_notes          text,
  p_customer_name  text,
  p_customer_phone text,
  p_items          jsonb  -- [{product_id, color_id, size_id, quantity, unit_price, product_name, color_name, size_label}]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  -- 1. Insere o cabeçalho do pedido
  INSERT INTO public.orders (
    user_id,
    total,
    freight,
    fulfillment_type,
    cep,
    street,
    street_number,
    neighborhood,
    city,
    notes,
    customer_name,
    customer_phone,
    status
  )
  VALUES (
    p_user_id,
    p_total,
    p_freight,
    p_fulfillment_type::fulfillment_type,
    p_cep,
    p_street,
    p_street_number,
    p_neighborhood,
    p_city,
    p_notes,
    p_customer_name,
    p_customer_phone,
    'pending'
  )
  RETURNING id INTO v_order_id;

  -- 2. Insere os itens a partir do array JSONB (mesmo statement → atomicidade garantida)
  INSERT INTO public.order_items (
    order_id,
    product_id,
    color_id,
    size_id,
    quantity,
    unit_price,
    product_name,
    color_name,
    size_label
  )
  SELECT
    v_order_id,
    (item->>'product_id')::uuid,
    NULLIF(item->>'color_id',  '')::uuid,
    NULLIF(item->>'size_id',   '')::uuid,
    (item->>'quantity')::int,
    (item->>'unit_price')::numeric,
    item->>'product_name',
    item->>'color_name',
    item->>'size_label'
  FROM jsonb_array_elements(p_items) AS item;

  RETURN v_order_id;
END;
$$;

-- Apenas usuários autenticados podem chamar esta função
REVOKE ALL ON FUNCTION public.create_order_atomic FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_order_atomic FROM anon;
GRANT EXECUTE ON FUNCTION public.create_order_atomic TO authenticated;
