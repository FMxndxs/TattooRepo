'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'

export function CartIcon() {
  const itemCount = useCartStore((s) => s.itemCount)
  const reduced = useReducedMotion()

  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.08 }}
      whileTap={reduced ? undefined : { scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 480, damping: 26 }}
    >
      <Link
        href="/cart"
        aria-label="carrinho"
        className="relative flex items-center justify-center w-9 h-9 rounded-full border border-zinc-700/60 text-zinc-400 hover:text-brand-300 hover:border-brand-500/60 hover:bg-brand-700/10 transition-colors"
      >
        <ShoppingBag className="w-[18px] h-[18px]" />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-brand-300 text-zinc-950 text-[10px] font-bold min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center leading-none">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </Link>
    </motion.div>
  )
}
