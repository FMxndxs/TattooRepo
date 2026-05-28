import type { ChatNode } from '../types'
import { faqNodes } from './faq'
import { customOrderGuideNodes } from './customOrderGuide'
import { whatsappNodes } from './whatsappTree'
import { catalogNodes } from './catalogTree'

const rootNodes: ChatNode[] = [
  {
    id: 'root',
    type: 'greeting',
    message:
      'E aí! Eu sou o Nozzle, assistente da Imagination 3D! 🖨️✨\n\nComo posso te ajudar hoje?',
    options: [
      { label: '❓ Tirar dúvidas (FAQ)', nextNodeId: 'faq-menu' },
      { label: '🛍️ Explorar catálogo', nextNodeId: 'catalog-menu' },
      { label: '✨ Pedido personalizado', nextNodeId: 'custom-order-guide' },
      { label: '💬 Falar no WhatsApp', nextNodeId: 'whatsapp-contact' },
    ],
  },
]

export const allNodes: ChatNode[] = [
  ...rootNodes,
  ...faqNodes,
  ...customOrderGuideNodes,
  ...whatsappNodes,
  ...catalogNodes,
]
