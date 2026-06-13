-- Migration 024: Adiciona estados de produção 3D ao enum order_status
-- IMPORTANTE: ALTER TYPE ADD VALUE não pode rodar dentro de bloco transacional
-- no Postgres < 14. Rodar esta migration isolada, antes das demais.
-- Projeto Supabase: oflozudwutxgvwyvygll

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'finishing';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'ready';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'out_for_delivery';
