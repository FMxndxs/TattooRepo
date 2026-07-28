import { normalizeOrders } from '@/lib/admin/orders'
import type { Order, CustomOrder } from '@/types'

const baseOrder: Order = {
  id: 'o1',
  user_id: 'u1',
  customer_name: 'Ana Silva',
  customer_phone: '(11) 91111-1111',
  status: 'pending',
  total: 99.9,
  freight: null,
  cep: null,
  street: null,
  street_number: null,
  neighborhood: 'Centro',
  city: 'SP',
  notes: null,
  created_at: '2026-05-01T10:00:00Z',
  order_code: 'A4F9',
  fulfillment_type: 'pickup',
  courier_name: null,
  tracking_code: null,
  items: [
    {
      id: 'i1',
      order_id: 'o1',
      product_id: 'p1',
      color_id: null,
      size_id: null,
      quantity: 2,
      unit_price: 49.95,
      product_name: 'Vaso Hexagonal',
      color_name: null,
      size_label: null,
      product: {
        id: 'p1',
        name: 'Vaso Hexagonal',
        slug: '',
        category_id: null,
        description: null,
        print_time_minutes: null,
        filament_grams: null,
        price: 49.95,
        is_available: true,
        is_featured: false,
        allows_custom_size: false,
        allows_custom_color: false,
        makerworld_url: null,
        created_at: '',
        updated_at: '',
      },
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
  order_code: 'B7K2',
  created_at: '2026-05-02T10:00:00Z',
}

describe('normalizeOrders', () => {
  it('merges orders and custom_orders into AdminOrderRow[]', () => {
    const result = normalizeOrders([baseOrder], [baseCustom])
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.type)).toEqual(expect.arrayContaining(['normal', 'custom']))
  })

  it('sorts by created_at descending (mais recente primeiro)', () => {
    const result = normalizeOrders([baseOrder], [baseCustom])
    // Bruno (2026-05-02) é mais recente que Ana (2026-05-01)
    expect(result[0].customer_name).toBe('Bruno Costa')
    expect(result[1].customer_name).toBe('Ana Silva')
  })

  it('expõe order_code no AdminOrderRow', () => {
    const result = normalizeOrders([baseOrder], [baseCustom])
    const ana = result.find((r) => r.customer_name === 'Ana Silva')!
    expect(ana.order_code).toBe('A4F9')
    const bruno = result.find((r) => r.customer_name === 'Bruno Costa')!
    expect(bruno.order_code).toBe('B7K2')
  })

  it('expõe fulfillment_type no AdminOrderRow de pedido normal', () => {
    const result = normalizeOrders([baseOrder], [])
    expect(result[0].fulfillment_type).toBe('pickup')
  })

  it('builds summary from order items using product_name snapshot', () => {
    const result = normalizeOrders([baseOrder], [])
    expect(result[0].summary).toBe('2× Vaso Hexagonal')
  })

  it('falls back to product.name when product_name snapshot is null', () => {
    const orderNoSnapshot: Order = {
      ...baseOrder,
      items: [
        {
          ...baseOrder.items![0],
          product_name: null,
          product: { ...baseOrder.items![0].product!, name: 'Suporte Hexagonal' },
        },
      ],
    }
    const result = normalizeOrders([orderNoSnapshot], [])
    expect(result[0].summary).toBe('2× Suporte Hexagonal')
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

  it('handles custom_order status no ciclo de orçamento (reviewing)', () => {
    const custom: CustomOrder = { ...baseCustom, status: 'reviewing' }
    const result = normalizeOrders([], [custom])
    expect(result[0].status).toBe('reviewing')
  })

  it('handles custom_order status no ciclo de produção (in_production)', () => {
    const custom: CustomOrder = { ...baseCustom, status: 'in_production' }
    const result = normalizeOrders([], [custom])
    expect(result[0].status).toBe('in_production')
  })

  it('maps order_code null for pre-mig026 orders', () => {
    const oldOrder: Order = { ...baseOrder, order_code: null }
    const result = normalizeOrders([oldOrder], [])
    expect(result[0].order_code).toBeNull()
  })

  it('returns empty array for no input', () => {
    expect(normalizeOrders([], [])).toEqual([])
  })
})
