import type { ChatNode } from '../types'

export const catalogNodes: ChatNode[] = [
  {
    id: 'catalog-menu',
    type: 'menu',
    message: 'Explore nosso catálogo! Escolha uma categoria para ver os produtos. 🛍️',
    options: [
      { label: '🏡 Decoração', nextNodeId: 'catalog-cat-decoracao' },
      { label: '🔧 Utilitários', nextNodeId: 'catalog-cat-utilitarios' },
      { label: '💼 Escritório', nextNodeId: 'catalog-cat-escritorio' },
      { label: '🎮 Games', nextNodeId: 'catalog-cat-games' },
    ],
  },
  {
    id: 'catalog-menu-2',
    type: 'menu',
    message: 'Mais categorias disponíveis! 🎨',
    options: [
      { label: '🧸 Bonecos', nextNodeId: 'catalog-cat-bonecos' },
      { label: '💄 Maquiagem', nextNodeId: 'catalog-cat-maquiagem' },
      { label: '🎁 Brindes', nextNodeId: 'catalog-cat-brindes' },
      { label: '✨ Personalizados', nextNodeId: 'catalog-cat-personalizados' },
    ],
  },
  {
    id: 'catalog-cat-decoracao',
    type: 'product-list',
    message: 'Produtos de decoração — objetos únicos para deixar sua casa especial! 🏡',
    categorySlug: 'decoracao',
    options: [
      { label: 'Ver todas as categorias', nextNodeId: 'catalog-menu' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-cat-utilitarios',
    type: 'product-list',
    message: 'Utilitários práticos para o dia a dia! 🔧',
    categorySlug: 'utilitarios',
    options: [
      { label: 'Ver todas as categorias', nextNodeId: 'catalog-menu' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-cat-escritorio',
    type: 'product-list',
    message: 'Organização e estilo para seu escritório! 💼',
    categorySlug: 'escritorio',
    options: [
      { label: 'Ver todas as categorias', nextNodeId: 'catalog-menu' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-cat-games',
    type: 'product-list',
    message: 'Para os gamers! Acessórios e itens temáticos. 🎮',
    categorySlug: 'games',
    options: [
      { label: 'Ver todas as categorias', nextNodeId: 'catalog-menu' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-cat-bonecos',
    type: 'product-list',
    message: 'Bonecos e figuras detalhadas em 3D! 🧸',
    categorySlug: 'bonecos',
    options: [
      { label: 'Mais categorias', nextNodeId: 'catalog-menu-2' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-cat-maquiagem',
    type: 'product-list',
    message: 'Organizadores e acessórios de maquiagem! 💄',
    categorySlug: 'maquiagem',
    options: [
      { label: 'Mais categorias', nextNodeId: 'catalog-menu-2' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-cat-brindes',
    type: 'product-list',
    message: 'Brindes personalizados para sua empresa ou evento! 🎁',
    categorySlug: 'brindes',
    options: [
      { label: 'Mais categorias', nextNodeId: 'catalog-menu-2' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-cat-personalizados',
    type: 'product-list',
    message: 'Itens personalizados feitos especialmente! ✨',
    categorySlug: 'personalizados',
    options: [
      { label: 'Mais categorias', nextNodeId: 'catalog-menu-2' },
      { label: '🛒 Ver catálogo completo', nextNodeId: 'catalog-full' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'catalog-full',
    type: 'action',
    message: 'Abrindo o catálogo completo para você! 🛒',
    action: { type: 'navigate', payload: '/catalog' },
  },
]
