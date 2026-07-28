-- Migration 016 — Remover 80 produtos genéricos inseridos por engano via
-- seed 002_products_expansion.sql (sessão 2026-05-29).
-- Os 80 produtos do seed 002_makerworld_products.sql são mantidos intactos.
-- ON DELETE CASCADE em product_images e product_colors limpa dependências automaticamente.

BEGIN;

DELETE FROM products WHERE slug IN (
  -- Decoração (10)
  'mandala-parede-geometrica',
  'cachepo-ondulado-minimalista',
  'porta-retratos-flutuante',
  'escultura-abstrata-espiral',
  'castichal-geometrico-duo',
  'letra-decorativa-3d',
  'miniatura-casa-nordica',
  'vaso-geometrico-facetado-grande',
  'plaquinha-identificacao-planta',
  'relogio-parede-minimalista',
  -- Utilitários (10)
  'cabide-parede-minimalista',
  'suporte-tablet-universal',
  'porta-temperos-giratorio',
  'clips-vedacao-embalagens',
  'suporte-livro-leitura',
  'descanso-colher-espatula',
  'separador-gaveta-modular',
  'suporte-earbuds-carregador',
  'distribuidor-sacolas-plasticas',
  'prendedor-toalha-forno',
  -- Escritório (10)
  'suporte-elevador-notebook',
  'organizador-clips-grampos',
  'suporte-webcam-monitor',
  'caixa-organizadora-gaveta',
  'stand-dobravel-ipad',
  'porta-post-it-mesa',
  'roteador-cabos-mesa',
  'porta-etiquetas-arquivo',
  'nameplate-mesa-personalizavel',
  'suporte-documentos-em-l',
  -- Games (10)
  'caixa-dados-rpg-tampa',
  'organizador-cartas-colecao',
  'suporte-cartucho-retro',
  'dado-d20-decorativo-grande',
  'stand-figuras-amiibos',
  'organizador-mesa-gamer',
  'peao-personalizado-tabuleiro',
  'tokens-vida-rpg',
  'case-nintendo-switch',
  'mapa-hexagonal-modular-rpg',
  -- Bonecos (10)
  'gato-articulado-print-in-place',
  'polvo-flexivel-print-in-place',
  'urso-low-poly-sentado',
  'tubarao-articulado',
  'coelho-low-poly-decorativo',
  'robo-modular-articulado',
  'dinossauro-trex-articulado',
  'peixe-koi-flexivel',
  'cobra-articulada-print-in-place',
  'cavalinho-xadrez-decorativo',
  -- Maquiagem (10)
  'organizador-sombras-grade',
  'porta-esmaltes-escalonado',
  'suporte-parede-secador',
  'caixa-joias-compartimentos',
  'suporte-perfumes-degraus',
  'porta-delineadores-lapis-circular',
  'bandeja-organizadora-skincare',
  'organizador-brincos-colares',
  'porta-hastes-cotonetes',
  'suporte-escovas-cabelo',
  -- Brindes (10)
  'ima-geladeira-personalizado',
  'miniatura-profissao',
  'porta-vela-geometrico-decorativo',
  'trofeu-personalizado-simples',
  'plaquinha-identificacao-pet',
  'enfeite-natalino-personalizado',
  'pingente-personalizado',
  'kit-lembrancinhas-formatura',
  'plaquinha-decorativa-ambiente',
  'porta-lapis-corporativo',
  -- Personalizados (10)
  'peca-reposicao-sob-medida',
  'case-personalizada-produto',
  'modelo-arquitetonico-miniatura',
  'lettering-nome-3d',
  'suporte-especifico-sob-medida',
  'prototipagem-rapida',
  'kit-personalizado-empresa',
  'busto-personalizado-pessoa',
  'peca-mecanica-funcional',
  'decoracao-tematica-festa'
);

COMMIT;

-- ============================================================
-- Verificação (execute após o COMMIT)
-- ============================================================
-- SELECT count(*) FROM products;
-- Esperado: 102 (22 originais + 80 MakerWorld)
--
-- SELECT cat.name, count(p.id) AS total
-- FROM products p JOIN categories cat ON cat.id = p.category_id
-- GROUP BY cat.name ORDER BY cat.name;
-- Esperado: 8 categorias, decoracao/utilitarios/.../games = 13 cada, personalizados = 11
--
-- SELECT count(*) FROM products WHERE makerworld_url IS NOT NULL;
-- Esperado: 80
--
-- SELECT count(*) FROM product_images WHERE url LIKE '%placehold.co%';
-- Esperado: 0
--
-- SELECT count(*) FROM product_images WHERE url LIKE '%picsum.photos%';
-- Esperado: 1 (descanso-de-panela-modular, seed 001)
