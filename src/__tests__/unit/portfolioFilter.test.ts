import { portfolioFilterOptions, filterPortfolioItems } from '@/lib/portfolio/filter'
import type { PortfolioItem } from '@/types/booking'

const items: PortfolioItem[] = [
  { id: '1', title: 'A', image_url: 'a.jpg', style: 'Blackwork', body_placement: 'braço', sort_order: 0 },
  { id: '2', title: 'B', image_url: 'b.jpg', style: 'Fineline', body_placement: 'perna', sort_order: 1 },
  { id: '3', title: 'C', image_url: 'c.jpg', style: 'Blackwork', body_placement: 'perna', sort_order: 2 },
  { id: '4', title: 'D', image_url: 'd.jpg', style: null, body_placement: null, sort_order: 3 },
]

describe('portfolioFilterOptions', () => {
  it('deriva estilos únicos, ignorando null', () => {
    const { styles } = portfolioFilterOptions(items)
    expect(styles).toEqual(['Blackwork', 'Fineline'])
  })

  it('deriva locais do corpo únicos, ignorando null', () => {
    const { placements } = portfolioFilterOptions(items)
    expect(placements).toEqual(['braço', 'perna'])
  })

  it('retorna arrays vazios para lista vazia', () => {
    expect(portfolioFilterOptions([])).toEqual({ styles: [], placements: [] })
  })
})

describe('filterPortfolioItems', () => {
  it('sem filtro retorna todos os itens', () => {
    expect(filterPortfolioItems(items, {})).toHaveLength(4)
  })

  it('filtra por estilo', () => {
    const result = filterPortfolioItems(items, { estilo: 'Blackwork' })
    expect(result.map((i) => i.id)).toEqual(['1', '3'])
  })

  it('filtra por local do corpo', () => {
    const result = filterPortfolioItems(items, { local: 'perna' })
    expect(result.map((i) => i.id)).toEqual(['2', '3'])
  })

  it('combina estilo e local (AND)', () => {
    const result = filterPortfolioItems(items, { estilo: 'Blackwork', local: 'perna' })
    expect(result.map((i) => i.id)).toEqual(['3'])
  })

  it('retorna vazio quando nenhum item bate os dois filtros', () => {
    const result = filterPortfolioItems(items, { estilo: 'Fineline', local: 'braço' })
    expect(result).toHaveLength(0)
  })
})
