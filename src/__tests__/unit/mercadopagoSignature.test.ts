import crypto from 'node:crypto'
import { verifyWebhookSignature } from '@/lib/payments/mercadopago'

const SECRET = 'test-secret'

function sign(dataId: string, ts: string, requestId: string | null) {
  const manifest = `id:${dataId};request-id:${requestId ?? ''};ts:${ts};`
  const v1 = crypto.createHmac('sha256', SECRET).update(manifest).digest('hex')
  return `ts=${ts},v1=${v1}`
}

describe('verifyWebhookSignature', () => {
  const originalSecret = process.env.MP_WEBHOOK_SECRET

  beforeEach(() => {
    process.env.MP_WEBHOOK_SECRET = SECRET
  })
  afterAll(() => {
    process.env.MP_WEBHOOK_SECRET = originalSecret
  })

  it('aceita assinatura valida', () => {
    const xSignature = sign('123', '1700000000', 'req-1')
    expect(
      verifyWebhookSignature({ xSignature, xRequestId: 'req-1', dataId: '123' }),
    ).toBe(true)
  })

  it('rejeita assinatura com dataId diferente do assinado', () => {
    const xSignature = sign('123', '1700000000', 'req-1')
    expect(
      verifyWebhookSignature({ xSignature, xRequestId: 'req-1', dataId: '999' }),
    ).toBe(false)
  })

  it('rejeita quando falta o header x-signature', () => {
    expect(
      verifyWebhookSignature({ xSignature: null, xRequestId: 'req-1', dataId: '123' }),
    ).toBe(false)
  })

  it('rejeita assinatura malformada', () => {
    expect(
      verifyWebhookSignature({ xSignature: 'garbage', xRequestId: 'req-1', dataId: '123' }),
    ).toBe(false)
  })

  it('rejeita quando o segredo nao esta configurado', () => {
    delete process.env.MP_WEBHOOK_SECRET
    const xSignature = sign('123', '1700000000', 'req-1')
    expect(
      verifyWebhookSignature({ xSignature, xRequestId: 'req-1', dataId: '123' }),
    ).toBe(false)
  })
})
