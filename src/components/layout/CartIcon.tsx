'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'

export function CartIcon() {
  const itemCount = useCartStore((s) => s.itemCount)

  return (
    <Link href="/cart" aria-label="carrinho" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  )
}
