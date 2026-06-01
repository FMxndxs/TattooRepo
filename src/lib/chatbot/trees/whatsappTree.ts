import type { ChatNode } from '../types'

export const whatsappNodes: ChatNode[] = [
  {
    id: 'whatsapp-contact',
    type: 'menu',
    message: 'Sem problema! Vou te conectar com a nossa equipe no WhatsApp. Sobre o que é? 📱',
    options: [
      { label: 'Problema com meu pedido', nextNodeId: 'whatsapp-order-issue' },
      { label: 'Dúvida sobre produto', nextNodeId: 'whatsapp-product-question' },
      { label: 'Quero falar com atendente', nextNodeId: 'whatsapp-general' },
      { label: 'Reportar defeito', nextNodeId: 'whatsapp-defect' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'whatsapp-order-issue',
    type: 'whatsapp-redirect',
    message:
      'Vou abrir o WhatsApp com uma mensagem sobre o seu pedido! O botão abaixo abre o WhatsApp direto. ✅',
    options: [
      { label: '💬 Abrir WhatsApp', nextNodeId: 'open-whatsapp-order' },
      { label: 'Voltar', nextNodeId: 'whatsapp-contact' },
    ],
  },
  {
    id: 'open-whatsapp-order',
    type: 'whatsapp-redirect',
    message: 'Abrindo WhatsApp...',
    action: {
      type: 'open-whatsapp',
      payload: 'Olá! Preciso de ajuda com um problema no meu pedido.',
    },
  },
  {
    id: 'whatsapp-product-question',
    type: 'whatsapp-redirect',
    message: 'Vou te conectar para tirar dúvidas sobre produtos! 🎯',
    options: [
      { label: '💬 Abrir WhatsApp', nextNodeId: 'open-whatsapp-product' },
      { label: 'Voltar', nextNodeId: 'whatsapp-contact' },
    ],
  },
  {
    id: 'open-whatsapp-product',
    type: 'whatsapp-redirect',
    message: 'Abrindo WhatsApp...',
    action: {
      type: 'open-whatsapp',
      payload: 'Olá! Tenho uma dúvida sobre um produto da Imagination 3D.',
    },
  },
  {
    id: 'whatsapp-general',
    type: 'whatsapp-redirect',
    message: 'Conectando com nossa equipe agora! 😊',
    options: [
      { label: '💬 Abrir WhatsApp', nextNodeId: 'open-whatsapp-general' },
      { label: 'Voltar', nextNodeId: 'whatsapp-contact' },
    ],
  },
  {
    id: 'open-whatsapp-general',
    type: 'whatsapp-redirect',
    message: 'Abrindo WhatsApp...',
    action: {
      type: 'open-whatsapp',
      payload: 'Olá! Gostaria de falar com um atendente da Imagination 3D.',
    },
  },
  {
    id: 'whatsapp-defect',
    type: 'whatsapp-redirect',
    message: 'Sinto muito pelo inconveniente! Vamos resolver isso. 🔧',
    options: [
      { label: '💬 Abrir WhatsApp', nextNodeId: 'open-whatsapp-defect' },
      { label: 'Voltar', nextNodeId: 'whatsapp-contact' },
    ],
  },
  {
    id: 'open-whatsapp-defect',
    type: 'whatsapp-redirect',
    message: 'Abrindo WhatsApp...',
    action: {
      type: 'open-whatsapp',
      payload: 'Olá! Preciso reportar um defeito em um produto da Imagination 3D.',
    },
  },
]
