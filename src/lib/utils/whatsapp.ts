const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511989525014'

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
    'Novo Pedido Personalizado — Kadu Freitas Tattoo',
    '',
    `Cliente: ${payload.name}`,
    `Telefone: ${payload.phone}`,
  ]

  if (payload.email) lines.push(`E-mail: ${payload.email}`)

  lines.push(
    '',
    `Descrição: ${payload.description}`,
    `Estilo desejado: ${payload.color_name}`,
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
