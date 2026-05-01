'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import type { Product, Color, ProductSize } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedColor: Color | null
  selectedSize: ProductSize | null
}

export function AddToCartButton({ product, selectedColor, selectedSize }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, selectedColor, selectedSize, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all text-base ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-brand-700 hover:bg-brand-500 text-white'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Adicionado!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Adicionar ao carrinho
        </>
      )}
    </button>
  )
}
