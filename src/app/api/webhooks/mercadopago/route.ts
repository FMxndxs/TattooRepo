import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyWebhookSignature } from '@/lib/payments/mercadopago'
import { confirmBookingFromPayment, getPayment } from '@/lib/booking/service'

/**
 * Webhook do Mercado Pago. Nunca confia no payload sozinho:
 * 1. valida a assinatura HMAC (x-signature)
 * 2. consulta o pagamento direto na API do MP pelo id
 * 3. só confirma o agendamento se status === 'approved'
 * Idempotente via unique(mp_payment_id) + check de status já confirmado.
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const dataId = url.searchParams.get('data.id') ?? url.searchParams.get('id')
  const topic = url.searchParams.get('type') ?? url.searchParams.get('topic')

  if (!dataId || topic !== 'payment') return NextResponse.json({ received: true })

  const valid = verifyWebhookSignature({
    xSignature: request.headers.get('x-signature'),
    xRequestId: request.headers.get('x-request-id'),
    dataId,
  })
  if (!valid) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })

  const payment = await getPayment(dataId)
  if (payment.status !== 'approved') return NextResponse.json({ received: true })

  const client = createAdminClient()
  const result = await confirmBookingFromPayment(client, String(payment.id))
  if (!result.success) {
    // Log server-side; ainda respondemos 200 para o MP não reenviar em loop
    // por um erro de dados que não vai se resolver com retry.
    console.error('[mercadopago webhook] falha ao confirmar booking:', result.error)
  }

  return NextResponse.json({ received: true })
}
