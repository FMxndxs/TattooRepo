-- Migration 012: corrigir acentuação dos nomes de categorias
UPDATE categories SET name = 'Decoração'  WHERE slug = 'decoracao';
UPDATE categories SET name = 'Utilitários' WHERE slug = 'utilitarios';
UPDATE categories SET name = 'Escritório'  WHERE slug = 'escritorio';
