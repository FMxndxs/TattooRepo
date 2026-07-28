import { normalizeOrders } from '@/lib/admin/orders'
import type { CustomOrder } from '@/types'

const baseCustom: CustomOrder = {
  id: 'c1',
  customer_name: 'Bruno Costa',
  customer_phone: '(11) 92222-2222',
  description: 'Fênix em blackwork no antebraço',
  reference_url: null,
  reference_image_url: null,
  status: 'pending',
  order_code: 'B7K2',
  created_at: '2026-05-02T10:00:00Z',
}

const olderCustom: CustomOrder = {
  ...baseCustom,
  id: 'c2',
  customer_name: 'Ana Silva',
  created_at: '2026-05-01T10:00:00Z',
  order_code: 'A4F9',
}

describe('normalizeOrders', () => {
  it('converte custom_orders em AdminOrderRow[]', () => {
    const result = normalizeOrders([baseCustom])
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('c1')
  })

  it('sorts by created_at descending (mais recente primeiro)', () => {
    const result = normalizeOrders([olderCustom, baseCustom])
    expect(result[0].customer_name).toBe('Bruno Costa')
    expect(result[1].customer_name).toBe('Ana Silva')
  })

  it('expõe order_code no AdminOrderRow', () => {
    const result = normalizeOrders([baseCustom])
    expect(result[0].order_code).toBe('B7K2')
  })

  it('usa description como summary', () => {
    const result = normalizeOrders([baseCustom])
    expect(result[0].summary).toBe('Fênix em blackwork no antebraço')
  })

  it('maps missing customer_name to em dash', () => {
    const custom: CustomOrder = { ...baseCustom, customer_name: '' }
    const result = normalizeOrders([custom])
    expect(result[0].customer_name).toBe('—')
  })

  it('handles status do ciclo de orçamento (reviewing)', () => {
    const custom: CustomOrder = { ...baseCustom, status: 'reviewing' }
    const result = normalizeOrders([custom])
    expect(result[0].status).toBe('reviewing')
  })

  it('maps order_code null para registros antigos pré-mig026', () => {
    const custom: CustomOrder = { ...baseCustom, order_code: null }
    const result = normalizeOrders([custom])
    expect(result[0].order_code).toBeNull()
  })

  it('returns empty array for no input', () => {
    expect(normalizeOrders([])).toEqual([])
  })
})
