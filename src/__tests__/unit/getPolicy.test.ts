// Bug encontrado na auditoria (D-B2 não funcionava de fato): getPolicy lia a
// tabela `settings` (config de frete legada, colunas fixas hq_cep/freight_per_km)
// em vez de `app_settings` (key/value, onde cancellation_policy é de fato
// semeada em 100_tattoo_domain.sql). A query errava em silêncio e a política
// de cancelamento editada em /admin/settings nunca surtia efeito.

import { getPolicy } from '@/lib/booking/service'
import { DEFAULT_CANCELLATION_POLICY } from '@/lib/booking/stateMachine'

function makeClient(row: { data: unknown; error: unknown }) {
  const from = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue(row),
      }),
    }),
  })
  return { from }
}

describe('getPolicy', () => {
  it('lê da tabela app_settings, não de settings', async () => {
    const client = makeClient({ data: { value: { refundable_hours_before: 10, reschedule_hours_before: 5, max_reschedules: 2 } }, error: null })

    await getPolicy(client as never)

    expect(client.from).toHaveBeenCalledWith('app_settings')
    expect(client.from).not.toHaveBeenCalledWith('settings')
  })

  it('retorna o valor salvo quando a chave existe', async () => {
    const saved = { refundable_hours_before: 10, reschedule_hours_before: 5, max_reschedules: 2 }
    const client = makeClient({ data: { value: saved }, error: null })

    const policy = await getPolicy(client as never)

    expect(policy).toEqual(saved)
  })

  it('cai no fallback DEFAULT_CANCELLATION_POLICY quando a chave não existe', async () => {
    const client = makeClient({ data: null, error: null })

    const policy = await getPolicy(client as never)

    expect(policy).toEqual(DEFAULT_CANCELLATION_POLICY)
  })

  it('cai no fallback quando a query retorna erro', async () => {
    const client = makeClient({ data: null, error: new Error('tabela errada') })

    const policy = await getPolicy(client as never)

    expect(policy).toEqual(DEFAULT_CANCELLATION_POLICY)
  })
})
