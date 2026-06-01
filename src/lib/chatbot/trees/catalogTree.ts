import type { ChatNode, ChatSubFilter } from '../types'

const CATEGORIES = [
  { slug: 'decoracao',      label: 'Decoração',      emoji: '🏡' },
  { slug: 'utilitarios',   label: 'Utilitários',    emoji: '🔧' },
  { slug: 'escritorio',    label: 'Escritório',     emoji: '💼' },
  { slug: 'games',         label: 'Games',           emoji: '🎮' },
  { slug: 'bonecos',       label: 'Bonecos',         emoji: '🧸' },
  { slug: 'maquiagem',     label: 'Maquiagem',       emoji: '💄' },
  { slug: 'brindes',       label: 'Brindes',         emoji: '🎁' },
  { slug: 'personalizados', label: 'Personalizados', emoji: '✨' },
] as const

function makeSubNode(
  slug: string,
  label: string,
  emoji: string,
  subFilter: ChatSubFilter,
  message: string,
): ChatNode {
  return {
    id: `catalog-sub-${subFilter.replace('sort-price-asc', 'sort')}-${slug}`,
    type: 'product-list',
    message,
    categorySlug: slug,
    showProducts: true,
    subFilter,
    options: [
      ...(subFilter !== 'sort-price-asc'
        ? [{ label: '💰 Menor preço primeiro', nextNodeId: `catalog-sub-sort-${slug}` }]
        : []),
      { label: '🛒 Catálogo completo', nextNodeId: 'catalog-full' },
      { label: `↩️ Voltar a ${emoji} ${label}`, nextNodeId: `catalog-cat-${slug}` },
    ],
  }
}

function makeCategoryNodes(slug: string, label: string, emoji: string): ChatNode[] {
  return [
    {
      id: `catalog-cat-${slug}`,
      type: 'product-list',
      message: `${emoji} **${label}** — veja alguns dos nossos produtos impressos em 3D! 🖨️`,
      categorySlug: slug,
      showProducts: true,
      options: [
        { label: '⭐ Só os destaques', nextNodeId: `catalog-sub-featured-${slug}` },
        { label: '🔄 Ver mais produtos', nextNodeId: `catalog-sub-more-${slug}` },
        { label: '🛒 Catálogo completo', nextNodeId: 'catalog-full' },
        { label: '↩️ Voltar às categorias', nextNodeId: 'catalog-menu' },
      ],
    },
    makeSubNode(slug, label, emoji, 'featured', `⭐ Destaques em ${label}:`),
    makeSubNode(slug, label, emoji, 'more', `📦 Mais produtos em ${label}:`),
    makeSubNode(slug, label, emoji, 'sort-price-asc', `💰 ${label} — do menor ao maior preço:`),
  ]
}

export const catalogNodes: ChatNode[] = [
  {
    id: 'catalog-menu',
    type: 'menu',
    message: 'Explore nosso catálogo! Escolha uma categoria para ver os produtos. 🛍️',
    options: [
      ...CATEGORIES.map(({ slug, label, emoji }) => ({
        label: `${emoji} ${label}`,
        nextNodeId: `catalog-cat-${slug}`,
      })),
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  ...CATEGORIES.flatMap(({ slug, label, emoji }) => makeCategoryNodes(slug, label, emoji)),
  {
    id: 'catalog-full',
    type: 'action',
    message: 'Abrindo o catálogo completo para você! 🛒',
    action: { type: 'navigate', payload: '/catalog' },
    options: [
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
]
