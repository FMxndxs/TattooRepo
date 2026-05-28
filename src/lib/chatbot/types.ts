export type ChatNodeType =
  | 'greeting'
  | 'menu'
  | 'info'
  | 'action'
  | 'product-list'
  | 'whatsapp-redirect'

export interface ChatOption {
  label: string
  icon?: string
  nextNodeId: string
}

export interface ChatNodeAction {
  type: 'navigate' | 'open-url' | 'open-whatsapp'
  payload?: string
}

export interface ChatNode {
  id: string
  type: ChatNodeType
  message: string
  options?: ChatOption[]
  action?: ChatNodeAction
  categorySlug?: string // for product-list nodes
}

export interface ChatMessage {
  id: string
  from: 'nozzle' | 'user'
  text: string
  timestamp: number
  options?: ChatOption[]
  nodeId?: string
}
