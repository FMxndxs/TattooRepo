import type { ChatNode } from '../types'

export const faqNodes: ChatNode[] = [
  {
    id: 'faq-menu',
    type: 'menu',
    message: 'Claro! Sobre o que você quer saber? 🤔',
    options: [
      { label: 'Como funciona a impressão 3D?', nextNodeId: 'faq-how' },
      { label: 'Quanto tempo demora um pedido?', nextNodeId: 'faq-time' },
      { label: 'Quais materiais são usados?', nextNodeId: 'faq-materials' },
      { label: 'Frete e entrega', nextNodeId: 'faq-shipping' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'faq-how',
    type: 'info',
    message:
      'A impressão 3D cria objetos físicos camada por camada a partir de um arquivo digital! 🖨️\n\nUsamos a tecnologia FDM (Fused Deposition Modeling) com a impressora Bambu Lab A1, que deposita filamento plástico fundido em camadas ultra-finas para construir o objeto.',
    options: [
      { label: 'Quais materiais são usados?', nextNodeId: 'faq-materials' },
      { label: 'Quanto tempo demora?', nextNodeId: 'faq-time' },
      { label: 'Voltar ao menu de dúvidas', nextNodeId: 'faq-menu' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'faq-time',
    type: 'info',
    message:
      'O tempo varia conforme o tamanho e complexidade do projeto! ⏱️\n\n• Objetos pequenos (porta-treco, miniaturas): 1–4 horas\n• Objetos médios (suportes, decorações): 4–12 horas\n• Projetos grandes ou complexos: 12–24+ horas\n\nApós aprovação do orçamento, normalmente entregamos em 2–5 dias úteis.',
    options: [
      { label: 'E o frete?', nextNodeId: 'faq-shipping' },
      { label: 'Voltar ao menu de dúvidas', nextNodeId: 'faq-menu' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'faq-materials',
    type: 'info',
    message:
      'Usamos filamento PLA (ácido polilático)! 🎨\n\nO PLA é:\n• Derivado de fontes renováveis (amido de milho)\n• Resistente e durável para uso cotidiano\n• Disponível em muitas cores\n• Ideal para decoração, utilidades e peças não estruturais\n\nDisponível nas cores: Preto, Branco, Cinza, Vermelho, Azul, Verde, Amarelo, Laranja, Rosa e Roxo.',
    options: [
      { label: 'Ver catálogo de produtos', nextNodeId: 'catalog-menu' },
      { label: 'Fazer pedido personalizado', nextNodeId: 'custom-order-guide' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
  {
    id: 'faq-shipping',
    type: 'info',
    message:
      'Sobre entregas e frete! 📦\n\nAtendemos com retirada local ou entrega via Correios/motoboy para a região.\n\nO frete é calculado individualmente conforme o destino e o tamanho do pedido.\n\nEntre em contato pelo WhatsApp para mais detalhes sobre sua região específica.',
    options: [
      { label: 'Falar no WhatsApp sobre frete', nextNodeId: 'whatsapp-contact' },
      { label: 'Voltar ao menu de dúvidas', nextNodeId: 'faq-menu' },
      { label: '🏠 Menu principal', nextNodeId: 'root' },
    ],
  },
]
