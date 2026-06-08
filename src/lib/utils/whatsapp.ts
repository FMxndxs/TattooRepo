import type { WhatsAppOrderPayload } from '@/types'
import { formatBRL } from './formatters'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511989525014'

export function buildWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const { customer, items, total, deliveryQuote } = payload
  const freight = deliveryQuote?.freight ?? null
  const grandTotal = total + (freight ?? 0)

  const itemLines = items
    .map((item) => {
      const color = item.selected_color ? ` (${item.selected_color.name}` : ''
      const size = item.selected_size ? `, ${item.selected_size.label})` : color ? ')' : ''
      const label = `${item.product.name}${color}${size}`
      return `- ${label} x${item.quantity} — ${formatBRL(item.unit_price * item.quantity)}`
    })
    .join('\n')

  const lines = [
    'Novo Pedido — Imagination 3D',
    '',
    `Cliente: ${customer.name}`,
    `Telefone: ${customer.phone}`,
  ]

  if (customer.email) lines.push(`E-mail: ${customer.email}`)

  // Endereço completo
  lines.push(
    `CEP: ${customer.cep}`,
    `Endereço: ${customer.street}, ${customer.number}`,
    `Bairro: ${customer.neighborhood} / ${customer.city}`,
    '',
    'Itens:',
    itemLines,
    '',
    `Subtotal: ${formatBRL(total)}`,
  )

  // Frete e total
  if (deliveryQuote?.mode === 'delivery' && freight !== null) {
    lines.push(
      `Frete: ${formatBRL(freight)} (entrega própria · ${deliveryQuote.distanceKm?.toFixed(1)} km · R$ ${deliveryQuote.perKm.toFixed(2).replace('.', ',')}/km)`,
      `Total: ${formatBRL(grandTotal)}`,
    )
  } else if (deliveryQuote?.mode === 'pickup_or_courier') {
    lines.push(
      'Frete: a combinar (retirada na sede ou Uber Flash / 99 Entregas)',
      `Total: ${formatBRL(total)} + frete`,
    )
  } else {
    lines.push(
      'Frete: a combinar',
      `Total: ${formatBRL(total)} + frete`,
    )
  }

  lines.push('', 'Pedido gerado pelo site Imagination 3D')

  return lines.join('\n')
}

export function buildWhatsAppUrl(payload: WhatsAppOrderPayload): string {
  const message = buildWhatsAppMessage(payload)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export interface CustomOrderPayload {
  name: string
  phone: string
  email?: string
  description: string
  color_name: string
  reference_url: string | null
  image_url: string | null
}

export function buildCustomOrderMessage(payload: CustomOrderPayload): string {
  const lines = [
    'Novo Pedido Personalizado — Imagination 3D',
    '',
    `Cliente: ${payload.name}`,
    `Telefone: ${payload.phone}`,
  ]

  if (payload.email) lines.push(`E-mail: ${payload.email}`)

  lines.push(
    '',
    `Descrição: ${payload.description}`,
    `Cor desejada: ${payload.color_name}`,
  )

  if (payload.reference_url) lines.push(`Referência: ${payload.reference_url}`)
  if (payload.image_url) lines.push(`Imagem: ${payload.image_url}`)
  lines.push('', 'Aguardo seu orçamento!')
  return lines.join('\n')
}

export function buildCustomOrderUrl(payload: CustomOrderPayload): string {
  const message = buildCustomOrderMessage(payload)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Chatbot WhatsApp redirect helpers
export function buildSupportMessage(issue: string): string {
  return `Olá! Preciso de ajuda com: ${issue}`
}

export function buildSupportUrl(issue: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildSupportMessage(issue))}`
}
