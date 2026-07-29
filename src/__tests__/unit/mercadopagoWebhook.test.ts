/**
 * @jest-environment node
 */
// Rota sem nenhum teste antes desta auditoria (achado da Etapa 4 do Cycle E).
// NextRequest/Request precisam do ambiente node (jsdom não tem Request global).
// Cobre o contrato de segurança do webhook: filtro de tópico, assinatura
// inválida, status não aprovado e idempotência via confirmBookingFromPayment.

jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: jest.fn().mockReturnValue({ __marker: 'admin-client' }),
}))
jest.mock('@/lib/payments/mercadopago', () => ({
  verifyWebhookSignature: jest.fn(),
}))
jest.mock('@/lib/booking/service', () => ({
  confirmBookingFromPayment: jest.fn(),
  getPayment: jest.fn(),
}))

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/webhooks/mercadopago/route'
import { verifyWebhookSignature } from '@/lib/payments/mercadopago'
import { confirmBookingFromPayment, getPayment } from '@/lib/booking/service'

function makeRequest(query: string, headers: Record<string, string> = {}) {
  return new NextRequest(`https://example.com/api/webhooks/mercadopago?${query}`, {
    method: 'POST',
    headers,
  })
}

describe('POST /api/webhooks/mercadopago', () => {
  beforeEach(() => jest.clearAllMocks())

  it('ignora silenciosamente quando não é um evento de pagamento (sem dataId ou topic errado)', async () => {
    const res = await POST(makeRequest('type=merchant_order'))

    expect(res.status).toBe(200)
    expect(verifyWebhookSignature).not.toHaveBeenCalled()
    expect(getPayment).not.toHaveBeenCalled()
  })

  it('retorna 401 quando a assinatura é inválida', async () => {
    ;(verifyWebhookSignature as jest.Mock).mockReturnValue(false)

    const res = await POST(makeRequest('data.id=123&type=payment', { 'x-signature': 'bad' }))

    expect(res.status).toBe(401)
    expect(getPayment).not.toHaveBeenCalled()
  })

  it('não confirma o booking quando o pagamento não está aprovado', async () => {
    ;(verifyWebhookSignature as jest.Mock).mockReturnValue(true)
    ;(getPayment as jest.Mock).mockResolvedValue({ id: 123, status: 'pending' })

    const res = await POST(makeRequest('data.id=123&type=payment'))

    expect(res.status).toBe(200)
    expect(confirmBookingFromPayment).not.toHaveBeenCalled()
  })

  it('confirma o booking quando o pagamento está aprovado', async () => {
    ;(verifyWebhookSignature as jest.Mock).mockReturnValue(true)
    ;(getPayment as jest.Mock).mockResolvedValue({ id: 123, status: 'approved' })
    ;(confirmBookingFromPayment as jest.Mock).mockResolvedValue({ success: true })

    const res = await POST(makeRequest('data.id=123&type=payment'))

    expect(res.status).toBe(200)
    expect(confirmBookingFromPayment).toHaveBeenCalledWith(expect.anything(), '123')
  })

  it('responde 200 mesmo se confirmBookingFromPayment falhar, para o MP não reenviar', async () => {
    ;(verifyWebhookSignature as jest.Mock).mockReturnValue(true)
    ;(getPayment as jest.Mock).mockResolvedValue({ id: 123, status: 'approved' })
    ;(confirmBookingFromPayment as jest.Mock).mockResolvedValue({ success: false, error: 'boom' })
    const consoleErr = jest.spyOn(console, 'error').mockImplementation(() => {})

    const res = await POST(makeRequest('data.id=123&type=payment'))

    expect(res.status).toBe(200)
    expect(consoleErr).toHaveBeenCalled()
    consoleErr.mockRestore()
  })

  it('aceita `id`/`topic` como aliases de `data.id`/`type`', async () => {
    ;(verifyWebhookSignature as jest.Mock).mockReturnValue(true)
    ;(getPayment as jest.Mock).mockResolvedValue({ id: 999, status: 'approved' })
    ;(confirmBookingFromPayment as jest.Mock).mockResolvedValue({ success: true })

    const res = await POST(makeRequest('id=999&topic=payment'))

    expect(res.status).toBe(200)
    expect(getPayment).toHaveBeenCalledWith('999')
  })
})
