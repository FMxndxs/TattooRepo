-- Migration 009 — Imagens reais do Unsplash por produto
-- IDs extraídos diretamente das páginas de busca do Unsplash (CDN real, não inventado)
-- Execute no SQL Editor do Supabase Dashboard

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1772632696551-3eafa2d76490?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'vaso-geometrico-low-poly');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1774979300561-712abf6bcbb4?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'escultura-low-poly-raposa');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1550223025-c8c7c3cd2b6f?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-plantas-hexagonal');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1553556135-009e5858adce?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-celular-ajustavel');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1634839763563-97d93f8131c6?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-cabos-clip');

-- descanso-de-panela-modular: sem resultado no Unsplash, mantém picsum
UPDATE product_images SET url = 'https://picsum.photos/seed/kitchen-trivet/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'descanso-de-panela-modular');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1644463589256-02679b9c0767?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-mesa-premium');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1710265029735-434f63c672c4?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-fone-gamer');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1626148748386-888fb3ac7943?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'porta-cartoes-de-visita');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1563811771046-ba984ff30900?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'dice-tower-dobravel');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-controle-universal');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1545997281-2cfe4d4b740f?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'kit-miniaturas-tabletop');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1712874364529-2d17f6111bb1?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'axolotl-articulado');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1646009760741-857b7a005428?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'dragao-flexivel-print-in-place');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1623039978462-d01b0b1cad70?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'boneco-articulado-modular');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1667369039699-f30c4b863e51?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-pinceis-de-maquiagem');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1766242281507-dca096a98464?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-giratorio-de-batons');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1656797590428-653803a957fd?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'espelho-de-mesa-com-aro-decorativo');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1553060146-71667aa3f223?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'marca-paginas-personalizado');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1561237743-3aa447c271d1?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'mini-cofre-engrenagem');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1723404967037-1090e5a2ed90?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'porta-chaves-geometrico');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-1705475025559-ad8efdedc74f?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'projeto-personalizado');
