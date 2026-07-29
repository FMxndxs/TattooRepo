// Mock do Supabase e Next.js antes de importar as actions
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

import { getAppSettings, updateAppSetting } from '@/app/actions/settings'
import { createClient } from '@/lib/supabase/server'

describe('getAppSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('retorna objeto com configurações quando há dados no banco', async () => {
    const mockClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
        }),
      },
      from: jest.fn((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: { is_admin: true },
                  error: null,
                }),
              }),
            }),
          }
        }
        // Tabela app_settings
        return {
          select: jest.fn().mockResolvedValue({
            data: [
              { key: 'cancellation_policy', value: { refundable_hours_before: 72, reschedule_hours_before: 48, max_reschedules: 1 } },
            ],
            error: null,
          }),
        }
      }),
    }

    ;(createClient as jest.Mock).mockResolvedValue(mockClient)

    const result = await getAppSettings()
    expect(result.success).toBe(true)
    expect(result.data?.cancellation_policy).toEqual({ refundable_hours_before: 72, reschedule_hours_before: 48, max_reschedules: 1 })
  })

  it('retorna defaults quando nao ha dados', async () => {
    const mockClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
        }),
      },
      from: jest.fn((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: { is_admin: true },
                  error: null,
                }),
              }),
            }),
          }
        }
        // Tabela app_settings
        return {
          select: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }
      }),
    }

    ;(createClient as jest.Mock).mockResolvedValue(mockClient)

    const result = await getAppSettings()
    expect(result.success).toBe(true)
    // Default alinhado a DEFAULT_CANCELLATION_POLICY (src/lib/booking/stateMachine.ts),
    // mesmo valor semeado em 100_tattoo_domain.sql.
    expect(result.data?.cancellation_policy).toEqual({ refundable_hours_before: 72, reschedule_hours_before: 48, max_reschedules: 1 })
  })

  it('retorna erro quando usuario nao autenticado', async () => {
    const mockClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    }

    ;(createClient as jest.Mock).mockResolvedValue(mockClient)

    const result = await getAppSettings()
    expect(result.success).toBe(false)
    expect(result.error).toContain('Não autenticado')
  })

  it('retorna erro quando nao é admin', async () => {
    const mockClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { is_admin: false },
              error: null,
            }),
          }),
        }),
      }),
    }

    ;(createClient as jest.Mock).mockResolvedValue(mockClient)

    const result = await getAppSettings()
    expect(result.success).toBe(false)
    expect(result.error).toContain('Acesso negado')
  })
})

describe('updateAppSetting', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('atualiza configuração com sucesso', async () => {
    const mockClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
        }),
      },
      from: jest.fn((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: { is_admin: true },
                  error: null,
                }),
              }),
            }),
          }
        }
        // Tabela app_settings
        return {
          upsert: jest.fn().mockResolvedValue({
            error: null,
          }),
        }
      }),
    }

    ;(createClient as jest.Mock).mockResolvedValue(mockClient)

    const result = await updateAppSetting('cancellation_policy', { refundable_hours_before: 48 })
    expect(result.success).toBe(true)
  })

  it('retorna erro quando usuario nao autenticado', async () => {
    const mockClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    }

    ;(createClient as jest.Mock).mockResolvedValue(mockClient)

    const result = await updateAppSetting('cancellation_policy', { refundable_hours_before: 48 })
    expect(result.success).toBe(false)
    expect(result.error).toContain('Não autenticado')
  })

  it('retorna erro quando falha a operacao no banco', async () => {
    const mockClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
        }),
      },
      from: jest.fn((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: { is_admin: true },
                  error: null,
                }),
              }),
            }),
          }
        }
        // Tabela app_settings
        return {
          upsert: jest.fn().mockResolvedValue({
            error: new Error('Erro de banco'),
          }),
        }
      }),
    }

    ;(createClient as jest.Mock).mockResolvedValue(mockClient)

    const result = await updateAppSetting('cancellation_policy', { refundable_hours_before: 48 })
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
