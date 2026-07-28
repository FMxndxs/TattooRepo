-- Migration 026: Gerador de código amigável de pedido (ex. #A4F9)
-- Usa sequence + base32 Crockford para gerar um código curto, legível e único.
-- Projeto Supabase: oflozudwutxgvwyvygll

-- 1. Sequence global compartilhada entre orders e custom_orders
CREATE SEQUENCE IF NOT EXISTS order_seq START 1 INCREMENT 1;

-- 2. Função geradora (base32 Crockford, mínimo 4 chars)
CREATE OR REPLACE FUNCTION gen_order_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  n         BIGINT;
  alphabet  TEXT    := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  result    TEXT    := '';
  remainder INTEGER;
BEGIN
  n := nextval('order_seq');
  WHILE n > 0 LOOP
    remainder := (n % 32)::INTEGER;
    result    := substr(alphabet, remainder + 1, 1) || result;
    n         := n / 32;
  END LOOP;
  -- Garantir mínimo 4 caracteres com padding à esquerda
  WHILE length(result) < 4 LOOP
    result := '0' || result;
  END LOOP;
  RETURN result;
END;
$$;

-- 3. Coluna order_code em orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_code TEXT DEFAULT NULL;

-- 4. Coluna order_code em custom_orders
ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS order_code TEXT DEFAULT NULL;

-- 5. Índices únicos (filtram NULLs para não conflitar com backfill nulo)
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_code_idx
  ON public.orders(order_code)
  WHERE order_code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS custom_orders_order_code_idx
  ON public.custom_orders(order_code)
  WHERE order_code IS NOT NULL;

-- 6. Função trigger para preencher order_code automaticamente no INSERT
CREATE OR REPLACE FUNCTION set_order_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_code IS NULL THEN
    NEW.order_code := gen_order_code();
  END IF;
  RETURN NEW;
END;
$$;

-- 7. Triggers nas duas tabelas
CREATE OR REPLACE TRIGGER trg_orders_set_code
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION set_order_code();

CREATE OR REPLACE TRIGGER trg_custom_orders_set_code
  BEFORE INSERT ON public.custom_orders
  FOR EACH ROW EXECUTE FUNCTION set_order_code();

-- 8. Backfill: gerar codes para registros existentes (sem order_code)
UPDATE public.orders
  SET order_code = gen_order_code()
  WHERE order_code IS NULL;

UPDATE public.custom_orders
  SET order_code = gen_order_code()
  WHERE order_code IS NULL;
