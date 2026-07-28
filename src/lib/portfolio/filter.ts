import type { PortfolioItem } from '@/types/booking'

/** Opções de filtro disponíveis, derivadas dos itens existentes (sem duplicatas). */
export function portfolioFilterOptions(items: PortfolioItem[]): { styles: string[]; placements: string[] } {
  const styles = Array.from(new Set(items.map((i) => i.style).filter(Boolean))) as string[]
  const placements = Array.from(new Set(items.map((i) => i.body_placement).filter(Boolean))) as string[]
  return { styles, placements }
}

/** Filtra o portfólio por estilo e/ou local do corpo (undefined = sem filtro). */
export function filterPortfolioItems(
  items: PortfolioItem[],
  filters: { estilo?: string; local?: string },
): PortfolioItem[] {
  return items.filter((i) => {
    if (filters.estilo && i.style !== filters.estilo) return false
    if (filters.local && i.body_placement !== filters.local) return false
    return true
  })
}
