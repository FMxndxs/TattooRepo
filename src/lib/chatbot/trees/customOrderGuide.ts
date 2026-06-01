import type { ChatNode } from '../types'

export const customOrderGuideNodes: ChatNode[] = [
  {
    id: 'custom-order-guide',
    type: 'info',
    message:
      'Ótimo! Um pedido personalizado é feito especialmente pra você! ✨\n\nVocê descreve o que quer imprimir e a gente cria do zero — ou a partir de uma referência que você enviar.',
    options: [
      { label: 'Como enviar uma referência?', nextNodeId: 'custom-how-ref' },
      { label: 'Quais cores disponíveis?', nextNodeId: 'custom-colors' },
      { label: 'Como funciona o orçamento?', nextNodeId: 'custom-quote' },
      { label: 'Quero fazer um pedido agora!', nextNodeId: 'custom-cta' },
    ],
  },
  {
    id: 'custom-how-ref',
    type: 'info',
    message:
      'Para referências você pode enviar:\n\n📎 Link de um modelo (ex: MakerWorld, Thingiverse, Printables)\n🖼️ Uma foto ou imagem do que você quer\n📝 Uma descrição detalhada do objeto\n\nQuanto mais detalhes, melhor o resultado! 😊',
    options: [
      { label: 'Como funciona o orçamento?', nextNodeId: 'custom-quote' },
      { label: 'Fazer pedido agora!', nextNodeId: 'custom-cta' },
      { label: 'Voltar', nextNodeId: 'custom-order-guide' },
    ],
  },
  {
    id: 'custom-colors',
    type: 'info',
    message:
      'Cores disponíveis para pedidos personalizados! 🎨\n\nPreto • Branco • Cinza • Vermelho • Azul • Verde • Amarelo • Laranja • Rosa • Roxo\n\nSe precisar de uma cor especial, me conta no WhatsApp e verificamos a disponibilidade!',
    options: [
      { label: 'Fazer pedido agora!', nextNodeId: 'custom-cta' },
      { label: 'Falar no WhatsApp', nextNodeId: 'whatsapp-contact' },
      { label: 'Voltar', nextNodeId: 'custom-order-guide' },
    ],
  },
  {
    id: 'custom-quote',
    type: 'info',
    message:
      'O orçamento funciona assim! 💰\n\n1️⃣ Você preenche o formulário com a descrição e referências\n2️⃣ Enviamos via WhatsApp e respondemos com o orçamento em até 24h\n3️⃣ Aprovando, confirmamos o pagamento e iniciamos a impressão\n\nSem surpresas — o preço é fechado antes de começarmos!',
    options: [
      { label: 'Fazer pedido agora!', nextNodeId: 'custom-cta' },
      { label: 'Voltar', nextNodeId: 'custom-order-guide' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'custom-cta',
    type: 'info',
    message:
      'Perfeito! Clique no botão abaixo para acessar o formulário de pedido personalizado. Você precisa estar logado na conta para enviar. 🚀',
    options: [
      { label: '✨ Ir para pedido personalizado', nextNodeId: 'navigate-custom' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'navigate-custom',
    type: 'action',
    message: 'Te levando para o formulário de pedido personalizado!',
    action: { type: 'navigate', payload: '/custom-order' },
  },
]
