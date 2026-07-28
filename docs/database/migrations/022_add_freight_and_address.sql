-- Migration 022: adiciona campos de frete e endereço completo na tabela orders
-- Execute no SQL Editor do Supabase antes de usar o cálculo de frete no checkout.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS freight       numeric          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cep           text             DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS street        text             DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS street_number text             DEFAULT NULL;

COMMENT ON COLUMN orders.freight       IS 'Valor do frete em R$ calculado pelo site (null = a combinar)';
COMMENT ON COLUMN orders.cep           IS 'CEP do endereço de entrega (8 dígitos, sem hífen)';
COMMENT ON COLUMN orders.street        IS 'Logradouro preenchido via BrasilAPI';
COMMENT ON COLUMN orders.street_number IS 'Número do imóvel informado pelo cliente';
