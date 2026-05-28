import type { ChatNode } from './types'

/** Global node registry */
const registry = new Map<string, ChatNode>()

export function registerNodes(nodes: ChatNode[]): void {
  nodes.forEach((n) => registry.set(n.id, n))
}

export function getNode(id: string): ChatNode | undefined {
  return registry.get(id)
}

export function getRootNode(): ChatNode | undefined {
  return registry.get('root')
}
