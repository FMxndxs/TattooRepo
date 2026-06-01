import { registerNodes, getNode, getRootNode } from '@/lib/chatbot/engine'
import { allNodes } from '@/lib/chatbot/trees'
import type { ChatNode } from '@/lib/chatbot/types'

beforeEach(() => {
  registerNodes(allNodes)
})

describe('Chat Engine', () => {
  it('registra e recupera nodes corretamente', () => {
    const node = getNode('root')
    expect(node).toBeDefined()
    expect(node?.id).toBe('root')
  })

  it('getRootNode retorna o node raiz', () => {
    const root = getRootNode()
    expect(root?.id).toBe('root')
    expect(root?.type).toBe('greeting')
  })

  it('root node tem 4 opcoes de menu', () => {
    const root = getRootNode()
    expect(root?.options).toHaveLength(4)
  })

  it('todos os nextNodeIds das opcoes do root existem no registry', () => {
    const root = getRootNode()
    root?.options?.forEach((opt) => {
      expect(getNode(opt.nextNodeId)).toBeDefined()
    })
  })

  it('faq-menu tem opcoes que levam a nodes existentes', () => {
    const faqMenu = getNode('faq-menu')
    expect(faqMenu).toBeDefined()
    faqMenu?.options?.forEach((opt) => {
      expect(getNode(opt.nextNodeId)).toBeDefined()
    })
  })

  it('custom-order-guide existe e tem opcoes', () => {
    const node = getNode('custom-order-guide')
    expect(node).toBeDefined()
    expect(node?.options?.length).toBeGreaterThan(0)
  })

  it('whatsapp-contact existe e tem opcoes de redirect', () => {
    const node = getNode('whatsapp-contact')
    expect(node).toBeDefined()
    expect(node?.options?.length).toBeGreaterThan(0)
  })

  it('catalog-menu tem 8 categorias + opção de menu principal', () => {
    const menu = getNode('catalog-menu')
    expect(menu).toBeDefined()
    expect(menu?.options).toHaveLength(9)
  })

  it('catalog-menu inclui todas as 8 categorias esperadas', () => {
    const menu = getNode('catalog-menu')
    const nextIds = menu?.options?.map((o) => o.nextNodeId) ?? []
    const expected = [
      'catalog-cat-decoracao',
      'catalog-cat-utilitarios',
      'catalog-cat-escritorio',
      'catalog-cat-games',
      'catalog-cat-bonecos',
      'catalog-cat-maquiagem',
      'catalog-cat-brindes',
      'catalog-cat-personalizados',
    ]
    expected.forEach((id) => expect(nextIds).toContain(id))
  })

  it('todos os catalog-cat-* existem e tem showProducts=true', () => {
    const slugs = ['decoracao','utilitarios','escritorio','games','bonecos','maquiagem','brindes','personalizados']
    slugs.forEach((slug) => {
      const node = getNode(`catalog-cat-${slug}`)
      expect(node).toBeDefined()
      expect(node?.showProducts).toBe(true)
      expect(node?.categorySlug).toBe(slug)
    })
  })

  it('sub-nodes de categoria existem para cada slug', () => {
    const slugs = ['decoracao', 'games', 'bonecos']
    slugs.forEach((slug) => {
      expect(getNode(`catalog-sub-featured-${slug}`)).toBeDefined()
      expect(getNode(`catalog-sub-more-${slug}`)).toBeDefined()
      expect(getNode(`catalog-sub-sort-${slug}`)).toBeDefined()
    })
  })

  it('sub-nodes de categoria tem subFilter correto', () => {
    const node = getNode('catalog-sub-featured-decoracao')
    expect(node?.subFilter).toBe('featured')
    expect(getNode('catalog-sub-more-decoracao')?.subFilter).toBe('more')
    expect(getNode('catalog-sub-sort-decoracao')?.subFilter).toBe('sort-price-asc')
  })

  it('catalog-full tem action navigate para /catalog', () => {
    const node = getNode('catalog-full')
    expect(node).toBeDefined()
    expect(node?.action?.type).toBe('navigate')
    expect(node?.action?.payload).toBe('/catalog')
  })

  it('catalog-menu-2 nao existe mais (substituido por menu unificado)', () => {
    expect(getNode('catalog-menu-2')).toBeUndefined()
  })

  it('navigate-custom tem action navigate para /custom-order', () => {
    const ctaNode = getNode('navigate-custom')
    expect(ctaNode).toBeDefined()
    expect(ctaNode?.action?.type).toBe('navigate')
    expect(ctaNode?.action?.payload).toBe('/custom-order')
  })

  it('getNode retorna undefined para id inexistente', () => {
    expect(getNode('nao-existe-123')).toBeUndefined()
  })

  it('todos os allNodes tem id unico', () => {
    const ids = allNodes.map((n: ChatNode) => n.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('todos os nextNodeIds em allNodes apontam para nodes registrados', () => {
    const missingIds: string[] = []
    allNodes.forEach((node: ChatNode) => {
      node.options?.forEach((opt) => {
        if (!getNode(opt.nextNodeId)) {
          missingIds.push(`${node.id} → ${opt.nextNodeId}`)
        }
      })
    })
    expect(missingIds).toEqual([])
  })
})
