import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '@/lib/store/cartStore'
import type { Product, Color } from '@/types'

const mockProduct: Product = {
  id: 'p1',
  category_id: null,
  name: 'Suporte de Fone',
  slug: 'suporte-de-fone',
  description: null,
  print_time_minutes: 120,
  filament_grams: 45,
  price: 29.9,
  is_available: true,
  is_featured: false,
  allows_custom_size: false,
  allows_custom_color: true,
  created_at: '',
  updated_at: '',
}

const mockColor: Color = {
  id: 'c1',
  name: 'Preto',
  hex_code: '#1a1a1a',
  is_available: true,
}

beforeEach(() => {
  useCartStore.getState().clearCart()
})

describe('cartStore — addItem', () => {
  it('adiciona um item ao carrinho', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(mockProduct, mockColor, null, 1))
    expect(result.current.items).toHaveLength(1)
  })

  it('incrementa quantidade se produto ja existe com mesma cor', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(mockProduct, mockColor, null, 1))
    act(() => result.current.addItem(mockProduct, mockColor, null, 2))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(3)
  })

  it('adiciona como novo item se a cor for diferente', () => {
    const { result } = renderHook(() => useCartStore())
    const outraColor: Color = { ...mockColor, id: 'c2', name: 'Branco' }
    act(() => result.current.addItem(mockProduct, mockColor, null, 1))
    act(() => result.current.addItem(mockProduct, outraColor, null, 1))
    expect(result.current.items).toHaveLength(2)
  })
})

describe('cartStore — removeItem', () => {
  it('remove item pelo productId + colorId', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(mockProduct, mockColor, null, 1))
    act(() => result.current.removeItem('p1', 'c1'))
    expect(result.current.items).toHaveLength(0)
  })
})

describe('cartStore — updateQuantity', () => {
  it('atualiza a quantidade de um item', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(mockProduct, mockColor, null, 1))
    act(() => result.current.updateQuantity('p1', 'c1', 5))
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('remove o item se quantidade for 0', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(mockProduct, mockColor, null, 1))
    act(() => result.current.updateQuantity('p1', 'c1', 0))
    expect(result.current.items).toHaveLength(0)
  })
})

describe('cartStore — total e itemCount', () => {
  it('calcula o total corretamente', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(mockProduct, mockColor, null, 3))
    expect(result.current.total).toBeCloseTo(89.7)
  })

  it('conta o total de unidades', () => {
    const { result } = renderHook(() => useCartStore())
    const outraColor: Color = { ...mockColor, id: 'c2', name: 'Branco' }
    act(() => result.current.addItem(mockProduct, mockColor, null, 2))
    act(() => result.current.addItem(mockProduct, outraColor, null, 3))
    expect(result.current.itemCount).toBe(5)
  })
})

describe('cartStore — clearCart', () => {
  it('esvazia o carrinho', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(mockProduct, mockColor, null, 2))
    act(() => result.current.clearCart())
    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })
})
