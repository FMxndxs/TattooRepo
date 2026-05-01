-- Seed 001 — 22 produtos curados para Imagination 3D
-- Todos os modelos são de inspiração genérica (não nomes de modelos específicos protegidos)
-- Execute APÓS a migration 006 (8 categorias devem existir)
-- Imagens: placeholder https://placehold.co/600x600/1a1a2e/b683ff?text=Imagination+3D
-- O dono deve substituir pelas fotos reais das peças impressas
--
-- INSTRUÇÕES DE EXECUÇÃO:
-- 1. Execute no SQL Editor do Supabase (oflozudwutxgvwyvygll)
-- 2. Confirme que as 8 categorias existem: SELECT id, name, slug FROM categories ORDER BY name;
-- 3. Execute este script completo
-- 4. Verifique: SELECT count(*) FROM products;  → deve retornar 22

-- ============================================================
-- VARIÁVEIS DE CATEGORIA (UUIDs reais obtidos do banco)
-- ============================================================
-- Usamos subquery para pegar os IDs reais de cada categoria pelo slug

-- ============================================================
-- DECORAÇÃO (3 produtos)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Vaso Geométrico Low-Poly',
  'vaso-geometrico-low-poly',
  'Vaso decorativo em estilo low-poly com faces triangulares. Design moderno para plantas pequenas e suculentas. Altura aproximada de 12cm.',
  95, 68.0, 39.90, true, true, true, true
FROM categories c WHERE c.slug = 'decoracao';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Escultura Low-Poly Raposa',
  'escultura-low-poly-raposa',
  'Estatueta decorativa de raposa em estilo low-poly. Acabamento limpo e detalhado. Ideal para mesa, prateleira ou nicho. Altura 10cm.',
  110, 55.0, 44.90, true, false, false, true
FROM categories c WHERE c.slug = 'decoracao';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Suporte de Plantas Hexagonal',
  'suporte-plantas-hexagonal',
  'Conjunto de 3 suportes hexagonais modulares para vasos pequenos. Encaixam entre si para criar composições personalizadas na parede.',
  75, 42.0, 34.90, true, false, true, true
FROM categories c WHERE c.slug = 'decoracao';

-- ============================================================
-- UTILITÁRIOS (3 produtos)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Suporte de Celular Ajustável',
  'suporte-celular-ajustavel',
  'Suporte de mesa para celular com ângulo ajustável. Compatível com smartphones de até 7 polegadas. Encaixe antiderrapante.',
  60, 38.0, 29.90, true, true, false, true
FROM categories c WHERE c.slug = 'utilitarios';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Organizador de Cabos Clip',
  'organizador-cabos-clip',
  'Conjunto de 5 clips organizadores de cabo para mesa ou parede. Acomoda cabos de 3mm a 8mm. Fixação por adesivo 3M ou parafuso.',
  25, 18.0, 19.90, true, false, false, true
FROM categories c WHERE c.slug = 'utilitarios';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Descanso de Panela Modular',
  'descanso-panela-modular',
  'Descanso de panela em grade modular resistente ao calor (PLA+). Diâmetro 18cm. Pés emborrachados inclusos para não riscar a bancada.',
  80, 52.0, 37.90, true, false, false, true
FROM categories c WHERE c.slug = 'utilitarios';

-- ============================================================
-- ESCRITÓRIO (3 produtos)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Organizador de Mesa Premium',
  'organizador-mesa-premium',
  'Porta-canetas, clips e post-its em uma só peça. Compartimentos para 12 canetas, clips e cartões. Design minimalista e elegante.',
  120, 80.0, 54.90, true, true, false, true
FROM categories c WHERE c.slug = 'escritorio';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Suporte de Fone Gamer',
  'suporte-fone-gamer',
  'Suporte de headset para mesa com passagem de cabo integrada. Compatível com headsets de até 600g. Lateral plana para personalização.',
  90, 62.0, 44.90, true, true, false, true
FROM categories c WHERE c.slug = 'escritorio';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Porta-Cartões de Visita',
  'porta-cartoes-visita',
  'Porta-cartões de mesa com capacidade para 20 cartões. Ângulo de 45° para fácil acesso. Disponível com gravação de nome ou logo.',
  40, 28.0, 24.90, true, false, false, true
FROM categories c WHERE c.slug = 'escritorio';

-- ============================================================
-- GAMES (3 produtos)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Dice Tower Dobrável',
  'dice-tower-dobravel',
  'Torre de dados para RPG de mesa com bandeja coletora e design dobrável para fácil armazenamento. Compatível com dados de D4 a D20.',
  150, 95.0, 59.90, true, true, false, true
FROM categories c WHERE c.slug = 'games';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Suporte de Controle Universal',
  'suporte-controle-universal',
  'Suporte de parede para controles de PlayStation, Xbox, Nintendo e genéricos. Encaixe seguro sem parafusos nos controles.',
  55, 35.0, 27.90, true, false, false, true
FROM categories c WHERE c.slug = 'games';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Kit Miniaturas Tabletop (5 peças)',
  'kit-miniaturas-tabletop',
  'Kit com 5 miniaturas para jogos de tabuleiro RPG (soldado, mago, arqueiro, cavaleiro, dragão). Altura entre 3cm e 5cm. Ideal para D&D.',
  200, 30.0, 69.90, true, false, false, true
FROM categories c WHERE c.slug = 'games';

-- ============================================================
-- BONECOS & COLECIONÁVEIS (3 produtos)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Axolotl Articulado',
  'axolotl-articulado',
  'Axolotl totalmente articulado, impresso em uma peça sem suportes (print-in-place). Cada segmento mexe individualmente. Comprimento 20cm.',
  180, 48.0, 64.90, true, true, false, true
FROM categories c WHERE c.slug = 'bonecos';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Dragão Flexível Print-in-Place',
  'dragao-flexivel-print-in-place',
  'Dragão articulado impresso em uma única peça, sem montagem. Corpo com 30 segmentos flexíveis e cabeça detalhada. Comprimento 25cm.',
  240, 65.0, 79.90, true, true, false, true
FROM categories c WHERE c.slug = 'bonecos';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Boneco Articulado Modular',
  'boneco-articulado-modular',
  'Boneco humanoide com 12 pontos de articulação. Encaixes ball-joint permitem múltiplas poses. Altura 15cm. Ideal como referência de pose para artistas.',
  135, 55.0, 54.90, true, false, false, true
FROM categories c WHERE c.slug = 'bonecos';

-- ============================================================
-- MAQUIAGEM & BELEZA (3 produtos)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Organizador de Pincéis de Maquiagem',
  'organizador-pinceis-maquiagem',
  'Porta-pincéis em dois níveis com capacidade para 24 pincéis de tamanhos variados. Fundo removível para limpeza fácil.',
  100, 70.0, 47.90, true, false, false, true
FROM categories c WHERE c.slug = 'maquiagem';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Suporte Giratório de Batons',
  'suporte-giratorio-batons',
  'Suporte giratório 360° com 12 slots para batons, glosses e delineadores. Base estável com anel antiderrapante. Altura 14cm.',
  90, 58.0, 42.90, true, false, false, true
FROM categories c WHERE c.slug = 'maquiagem';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Espelho de Mesa com Aro Decorativo',
  'espelho-mesa-aro-decorativo',
  'Moldura impressa em 3D para espelho redondo de 15cm (espelho não incluso). Design com florais geométricos e encaixe de cabides para brincos.',
  120, 75.0, 49.90, true, false, false, true
FROM categories c WHERE c.slug = 'maquiagem';

-- ============================================================
-- BRINDES & PRESENTES (3 produtos)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Marca-Páginas Personalizado',
  'marca-paginas-personalizado',
  'Marca-páginas em PLA com nome ou palavra personalizada gravada. Tamanho padrão 2×15cm. Ideal para presentes, formaturas e eventos corporativos.',
  15, 8.0, 14.90, true, false, false, true
FROM categories c WHERE c.slug = 'brindes';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Mini Cofre Engrenagem',
  'mini-cofre-engrenagem',
  'Mini cofre decorativo com tampa de rosca em formato de engrenagem. Capacidade de ~200ml. Ótimo para guardar pequenos segredos ou lembrancinhas.',
  115, 78.0, 52.90, true, false, false, true
FROM categories c WHERE c.slug = 'brindes';

INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Porta-Chaves Geométrico',
  'porta-chaves-geometrico',
  'Porta-chaves de parede em design geométrico com 5 ganchos. Fácil fixação com parafusos. Aceita personalização de frase ou nome em relevo.',
  50, 32.0, 27.90, true, false, false, true
FROM categories c WHERE c.slug = 'brindes';

-- ============================================================
-- PERSONALIZADOS (1 produto de exemplo)
-- ============================================================
INSERT INTO products (category_id, name, slug, description, print_time_minutes, filament_grams, price, is_available, is_featured, allows_custom_size, allows_custom_color)
SELECT
  c.id,
  'Projeto Personalizado sob Medida',
  'projeto-personalizado',
  'Traga sua ideia e criamos juntos! Envie referências, medidas e cor desejada. Orçamento sem compromisso via WhatsApp. Prazo de 3 a 7 dias úteis após aprovação.',
  NULL, NULL, 49.90, true, false, true, true
FROM categories c WHERE c.slug = 'personalizados';

-- ============================================================
-- IMAGENS PLACEHOLDER (uma por produto)
-- ============================================================
INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT
  p.id,
  'https://placehold.co/600x600/1a1a2e/b683ff?text=' || replace(p.name, ' ', '+'),
  p.name,
  true,
  0
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- ============================================================
-- CORES DOS PRODUTOS (Preto e Branco para todos; produto-a-produto adicionar depois)
-- ============================================================
INSERT INTO product_colors (product_id, color_id, is_available)
SELECT p.id, c.id, true
FROM products p
CROSS JOIN colors c
WHERE c.name IN ('Preto', 'Branco', 'Cinza')
ON CONFLICT (product_id, color_id) DO NOTHING;

-- Cores extras para produtos destacados
INSERT INTO product_colors (product_id, color_id, is_available)
SELECT p.id, c.id, true
FROM products p
CROSS JOIN colors c
WHERE p.is_featured = true
  AND c.name IN ('Azul', 'Vermelho', 'Verde', 'Roxo')
ON CONFLICT (product_id, color_id) DO NOTHING;

-- ============================================================
-- Verificação final
-- ============================================================
-- SELECT p.name, cat.name as categoria, p.price, p.is_featured
-- FROM products p
-- JOIN categories cat ON cat.id = p.category_id
-- ORDER BY cat.name, p.name;
