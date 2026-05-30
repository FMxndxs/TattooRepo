import { normalizeOrders } from '@/lib/admin/orders'
import type { Order, CustomOrder } from '@/types'

const baseOrder: Order = {
  id: 'o1',
  user_id: 'u1',
  customer_name: 'Ana Silva',
  customer_phone: '(11) 91111-1111',
  status: 'pending',
  total: 99.9,
  neighborhood: 'Centro',
  city: 'SP',
  notes: null,
  created_at: '2026-05-01T10:00:00Z',
  items: [
    {
      id: 'i1',
      order_id: 'o1',
      product_id: 'p1',
      color_id: null,
      size_id: null,
      quantity: 2,
      unit_price: 49.95,
      product: { id: 'p1', name: 'Vaso Hexagonal', slug: '', category_id: null, description: null, print_time_minutes: null, filament_grams: null, price: 49.95, is_available: true, is_featured: false, allows_custom_size: false, allows_custom_color: false, makerworld_url: null, created_at: '', updated_at: '' },
    },
  ],
}

const baseCustom: CustomOrder = {
  id: 'c1',
  customer_name: 'Bruno Costa',
  customer_phone: '(11) 92222-2222',
  description: 'Caixa personalizada com logotipo',
  reference_url: null,
  reference_image_url: null,
  status: 'pending',
  created_at: '2026-05-02T10:00:00Z',
}

describe('normalizeOrders', () => {
  it('merges orders and custom_orders into AdminOrderRow[]', () => {
    const result = normalizeOrders([baseOrder], [baseCustom])
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.type)).toEqual(expect.arrayContaining(['normal', 'custom']))
  })

  it('sorts by customer_name alphabetically (pt-BR)', () => {
    const result = normalizeOrders([baseOrder], [baseCustom])
    // Ana < Bruno
    expect(result[0].customer_name).toBe('Ana Silva')
    expect(result[1].customer_name).toBe('Bruno Costa')
  })

  it('builds summary from order items', () => {
    const result = normalizeOrders([baseOrder], [])
    expect(result[0].summary).toBe('2× Vaso Hexagonal')
  })

  it('uses description as summary for custom orders', () => {
    const result = normalizeOrders([], [baseCustom])
    expect(result[0].summary).toBe('Caixa personalizada com logotipo')
  })

  it('maps missing customer_name to em dash', () => {
    const order: Order = { ...baseOrder, customer_name: '' }
    const result = normalizeOrders([order], [])
    expect(result[0].customer_name).toBe('—')
  })

  it('handles legacy custom_order status (reviewing)', () => {
    const custom: CustomOrder = { ...baseCustom, status: 'reviewing' }
    const result = normalizeOrders([], [custom])
    expect(result[0].status).toBe('reviewing')
  })

  it('returns empty array for no input', () => {
    expect(normalizeOrders([], [])).toEqual([])
  })
})
