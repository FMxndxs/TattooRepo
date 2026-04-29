import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Color, Product, ProductSize } from '@/types'

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (product: Product, color: Color | null, size: ProductSize | null, quantity: number) => void
  removeItem: (productId: string, colorId: string | null) => void
  updateQuantity: (productId: string, colorId: string | null, quantity: number) => void
  clearCart: () => void
}

function makeKey(productId: string, colorId: string | null) {
  return `${productId}::${colorId ?? 'none'}`
}

function computeDerived(items: CartItem[]) {
  return {
    total: items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem(product, color, size, quantity) {
        set((state) => {
          const key = makeKey(product.id, color?.id ?? null)
          const existing = state.items.find(
            (i) => makeKey(i.product.id, i.selected_color?.id ?? null) === key,
          )
          const items = existing
            ? state.items.map((i) =>
                makeKey(i.product.id, i.selected_color?.id ?? null) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              )
            : [
                ...state.items,
                { product, quantity, selected_color: color, selected_size: size, unit_price: product.price },
              ]
          return { items, ...computeDerived(items) }
        })
      },

      removeItem(productId, colorId) {
        set((state) => {
          const items = state.items.filter(
            (i) => makeKey(i.product.id, i.selected_color?.id ?? null) !== makeKey(productId, colorId),
          )
          return { items, ...computeDerived(items) }
        })
      },

      updateQuantity(productId, colorId, quantity) {
        if (quantity <= 0) {
          set((state) => {
            const items = state.items.filter(
              (i) => makeKey(i.product.id, i.selected_color?.id ?? null) !== makeKey(productId, colorId),
            )
            return { items, ...computeDerived(items) }
          })
          return
        }
        set((state) => {
          const items = state.items.map((i) =>
            makeKey(i.product.id, i.selected_color?.id ?? null) === makeKey(productId, colorId)
              ? { ...i, quantity }
              : i,
          )
          return { items, ...computeDerived(items) }
        })
      },

      clearCart() {
        set({ items: [], total: 0, itemCount: 0 })
      },
    }),
    { name: 'imagination3d-cart' },
  ),
)
