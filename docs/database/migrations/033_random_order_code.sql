-- Migration 033: order_code aleatório (discreto, não-sequencial)
-- Substitui o gerador baseado em sequence (migration 026) por geração aleatória.
-- Motivação: códigos sequenciais (0001, 0002...) revelam o volume de pedidos
-- da empresa, o que não é discreto para o cliente.
-- Projeto Supabase: oflozudwutxgvwyvygll

-- Apenas o corpo da função é substituído.
-- Os triggers (trg_orders_set_code, trg_custom_orders_set_code) e
-- a função trigger (set_order_code) continuam iguais — eles já chamam gen_order_code().
-- Os índices únicos (orders_order_code_idx, custom_orders_order_code_idx) permanecem.
-- A sequence order_seq fica orphan (não é mais usada) mas não é removida por segurança.
-- Códigos existentes NÃO são alterados.

CREATE OR REPLACE FUNCTION gen_order_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  alphabet  TEXT    := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';  -- base32 Crockford (sem I L O U)
  candidate TEXT;
  i         INTEGER;
  attempts  INTEGER := 0;
BEGIN
  LOOP
    -- Gera 5 caracteres aleatórios
    candidate := '';
    FOR i IN 1..5 LOOP
      candidate := candidate || substr(alphabet, floor(random() * 32)::int + 1, 1);
    END LOOP;

    -- Verifica unicidade global (orders + custom_orders)
    IF NOT EXISTS (SELECT 1 FROM public.orders        WHERE order_code = candidate)
   AND NOT EXISTS (SELECT 1 FROM public.custom_orders WHERE order_code = candidate) THEN
      RETURN candidate;
    END IF;

    attempts := attempts + 1;
    -- Fallback: após 50 tentativas (probabilidade < 1 em trilhões na prática),
    -- adiciona 6º caractere para garantir unicidade
    IF attempts >= 50 THEN
      RETURN candidate || substr(alphabet, floor(random() * 32)::int + 1, 1);
    END IF;
  END LOOP;
END;
$$;
