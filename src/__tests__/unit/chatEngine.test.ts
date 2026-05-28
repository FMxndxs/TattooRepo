import { registerNodes, getNode, getRootNode } from '@/lib/chatbot/engine'
import { allNodes } from '@/lib/chatbot/trees'
import type { ChatNode } from '@/lib/chatbot/types'

// Fresh engine state for tests
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
      const target = getNode(opt.nextNodeId)
      expect(target).toBeDefined()
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

  it('nodes de catalog existem', () => {
    expect(getNode('catalog-menu')).toBeDefined()
    expect(getNode('catalog-cat-decoracao')).toBeDefined()
    expect(getNode('catalog-cat-games')).toBeDefined()
  })

  it('nao retorna undefined para nodes de navigate action', () => {
    const ctaNode = getNode('custom-cta')
    expect(ctaNode).toBeDefined()
    expect(ctaNode?.action?.type).toBe('navigate')
  })

  it('getNode retorna undefined para id inexistente', () => {
    expect(getNode('nao-existe-123')).toBeUndefined()
  })

  it('todos os allNodes tem id unico', () => {
    const ids = allNodes.map((n: ChatNode) => n.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })
})
