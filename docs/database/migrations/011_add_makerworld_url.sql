-- Migration 011: adiciona referência ao modelo original no MakerWorld
-- Remover makerworld_url quando o produto tiver foto própria da empresa.

ALTER TABLE products ADD COLUMN IF NOT EXISTS makerworld_url TEXT;
