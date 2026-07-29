// P2-b da auditoria: createBookingAction era anônima e sem rate limit, permitindo
// criar bookings + cobranças Pix reais em loop. src/lib/security/rateLimit.ts já
// existia, testado, mas só era usado pelo próprio teste — agora está ligado nas
// Server Actions de booking.

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))
jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: jest.fn().mockReturnValue({}),
}))
jest.mock('@/lib/booking/service', () => ({
  createBooking: jest.fn().mockResolvedValue({ success: true, data: { booking: {}, pix: { qr_code: null, qr_code_base64: null } } }),
  cancelBookingByToken: jest.fn().mockResolvedValue({ success: true }),
  rescheduleBookingByToken: jest.fn().mockResolvedValue({ success: true }),
}))

import { headers } from 'next/headers'
import { createBookingAction, cancelBookingAction } from '@/app/actions/bookings'
import { createBooking } from '@/lib/booking/service'
import type { BookingFormData } from '@/lib/validations/booking'

function mockIp(ip: string) {
  ;(headers as jest.Mock).mockResolvedValue({
    get: (key: string) => (key.toLowerCase() === 'x-forwarded-for' ? ip : null),
  })
}

const validInput: BookingFormData = {
  service_id: '11111111-1111-4111-8111-111111111111',
  starts_at: '2026-08-01T10:00:00.000Z',
  customer_name: 'Cliente Teste',
  customer_phone: '11999999999',
  customer_email: 'cliente@example.com',
}

describe('createBookingAction — rate limit', () => {
  beforeEach(() => jest.clearAllMocks())

  it('permite as primeiras 5 requisições do mesmo IP', async () => {
    mockIp('203.0.113.10')
    for (let i = 0; i < 5; i++) {
      const result = await createBookingAction(validInput)
      expect(result.success).toBe(true)
    }
    expect(createBooking).toHaveBeenCalledTimes(5)
  })

  it('bloqueia a 6ª requisição do mesmo IP na janela', async () => {
    mockIp('203.0.113.11')
    for (let i = 0; i < 5; i++) await createBookingAction(validInput)

    const result = await createBookingAction(validInput)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Muitas tentativas/)
    expect(createBooking).toHaveBeenCalledTimes(5) // a 6ª não chegou a chamar o service
  })

  it('IPs diferentes têm limites independentes', async () => {
    mockIp('203.0.113.12')
    for (let i = 0; i < 5; i++) await createBookingAction(validInput)

    mockIp('203.0.113.13')
    const result = await createBookingAction(validInput)

    expect(result.success).toBe(true)
  })

  it('bucket de cancelamento é independente do bucket de criação', async () => {
    mockIp('203.0.113.14')
    for (let i = 0; i < 5; i++) await createBookingAction(validInput) // esgota booking:create

    const result = await cancelBookingAction('some-token')

    expect(result.success).toBe(true) // booking:cancel tem seu próprio contador (limite 10)
  })
})
