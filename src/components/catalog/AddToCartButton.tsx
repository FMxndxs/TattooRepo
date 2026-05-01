'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
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
  const reduced = useReducedMotion()

  function handleAdd() {
    addItem(product, selectedColor, selectedSize, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.button
      onClick={handleAdd}
      type="button"
      whileTap={reduced ? undefined : { scale: 0.982 }}
      whileHover={added || reduced ? undefined : { y: -1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 28 }}
      className={`relative w-full overflow-hidden flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-colors text-base ring-1 print-cta-sheen ${
        added
          ? 'bg-green-600 text-white ring-green-400/40'
          : 'bg-brand-700 hover:bg-brand-500 text-white ring-white/15 hover:shadow-[0_14px_44px_-12px_rgba(182,131,255,0.55)]'
      }`}
    >
      {!added && (
        <span className="print-cta-filament opacity-75" aria-hidden />
      )}
      <span className="relative z-10 flex items-center gap-2">
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
      </span>
    </motion.button>
  )
}
