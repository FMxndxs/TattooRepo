import 'server-only'
import crypto from 'node:crypto'

/**
 * Cliente mínimo da API REST do Mercado Pago — sem SDK.
 * ponytail: fetch direto cobre criar-pagamento-Pix e consultar-por-id; SDK
 * completo seria overkill para 2 chamadas. Upgrade se precisar de mais endpoints.
 */

const MP_API = 'https://api.mercadopago.com'

function token(): string {
  const t = process.env.MP_ACCESS_TOKEN
  if (!t) throw new Error('MP_ACCESS_TOKEN não configurado')
  return t
}

export interface PixPayment {
  id: number
  status: string // 'pending' | 'approved' | 'rejected' | ...
  qr_code: string | null
  qr_code_base64: string | null
  ticket_url: string | null
}

/** Cria um pagamento Pix para o sinal de um agendamento. */
export async function createPixPayment(params: {
  bookingId: string
  amount: number
  description: string
  payerEmail: string
  payerFirstName: string
  idempotencyKey: string
}): Promise<PixPayment> {
  const res = await fetch(`${MP_API}/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
      'X-Idempotency-Key': params.idempotencyKey,
    },
    body: JSON.stringify({
      transaction_amount: params.amount,
      description: params.description,
      payment_method_id: 'pix',
      payer: { email: params.payerEmail, first_name: params.payerFirstName },
      external_reference: params.bookingId,
      notification_url: process.env.MP_WEBHOOK_URL || undefined,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Mercado Pago createPixPayment falhou (${res.status}): ${body}`)
  }
  const data = await res.json()
  return {
    id: data.id,
    status: data.status,
    qr_code: data.point_of_interaction?.transaction_data?.qr_code ?? null,
    qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64 ?? null,
    ticket_url: data.point_of_interaction?.transaction_data?.ticket_url ?? null,
  }
}

/** Consulta um pagamento por id — NUNCA confiar apenas no payload do webhook. */
export async function getPayment(paymentId: string | number): Promise<{
  id: number
  status: string
  external_reference: string | null
}> {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token()}` },
  })
  if (!res.ok) throw new Error(`Mercado Pago getPayment falhou (${res.status})`)
  const data = await res.json()
  return { id: data.id, status: data.status, external_reference: data.external_reference ?? null }
}

/**
 * Verifica a assinatura HMAC do webhook do Mercado Pago.
 * Docs: header `x-signature` = "ts=...,v1=...", segredo em MP_WEBHOOK_SECRET.
 */
export function verifyWebhookSignature(params: {
  xSignature: string | null
  xRequestId: string | null
  dataId: string
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret || !params.xSignature) return false

  const parts = Object.fromEntries(
    params.xSignature.split(',').map((p) => p.trim().split('=') as [string, string]),
  )
  const ts = parts.ts
  const v1 = parts.v1
  if (!ts || !v1) return false

  const manifest = `id:${params.dataId};request-id:${params.xRequestId ?? ''};ts:${ts};`
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(v1)
  if (a.length !== b.length) return false

  return crypto.timingSafeEqual(a, b)
}
