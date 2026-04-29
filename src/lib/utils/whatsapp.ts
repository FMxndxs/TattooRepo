import type { WhatsAppOrderPayload } from '@/types'
import { formatBRL } from './formatters'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511989525014'

export function buildWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const { customer, items, total } = payload

  const itemLines = items
    .map((item) => {
      const color = item.selected_color ? ` (${item.selected_color.name}` : ''
      const size = item.selected_size ? `, ${item.selected_size.label})` : color ? ')' : ''
      const label = `${item.product.name}${color}${size}`
      return `- ${label} x${item.quantity} — ${formatBRL(item.unit_price * item.quantity)}`
    })
    .join('\n')

  return [
    'Novo Pedido — Imagination 3D',
    '',
    `Cliente: ${customer.name}`,
    `Telefone: ${customer.phone}`,
    `Bairro: ${customer.neighborhood} / ${customer.city}`,
    '',
    'Itens:',
    itemLines,
    '',
    `Total: ${formatBRL(total)}`,
    '',
    'Pedido gerado pelo site Imagination 3D',
  ].join('\n')
}

export function buildWhatsAppUrl(payload: WhatsAppOrderPayload): string {
  const message = buildWhatsAppMessage(payload)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}
