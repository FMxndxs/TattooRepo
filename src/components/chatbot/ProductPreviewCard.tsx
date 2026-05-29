'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useChatStore } from '@/lib/store/chatStore'
import { formatBRL } from '@/lib/utils/formatters'
import { LayerReveal } from '@/components/ui/MotionPrimitives'
import type { Product } from '@/types'

interface ProductPreviewCardProps {
  product: Product
  index?: number
}

export function ProductPreviewCard({ product, index = 0 }: ProductPreviewCardProps) {
  const reduced = useReducedMotion()
  const router = useRouter()
  const { addItem } = useCartStore()
  const { closeChat } = useChatStore()
  const [added, setAdded] = useState(false)

  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0]
  const imageUrl = primaryImage?.url ?? null

  function handleView() {
    closeChat()
    router.push(`/product/${product.slug}`)
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation()
    addItem(product, null, null, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <LayerReveal delay={index * 0.08}>
      <div className="group flex gap-3 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/60 hover:border-brand-700/50 transition-colors cursor-pointer">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
              3D
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <p className="text-xs font-medium text-white leading-snug line-clamp-2">{product.name}</p>
          <div className="flex items-center justify-between gap-2 mt-1.5">
            <span className="text-sm font-bold text-brand-300 tabular-nums">{formatBRL(product.price)}</span>
            <div className="flex gap-1.5">
              <motion.button
                type="button"
                onClick={handleAddToCart}
                whileTap={reduced ? undefined : { scale: 0.93 }}
                className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                  added
                    ? 'bg-brand-700 text-white'
                    : 'bg-zinc-800 hover:bg-brand-700/30 text-zinc-300 hover:text-brand-300'
                }`}
                aria-label={`Adicionar ${product.name} ao carrinho`}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>{added ? '✓' : '+'}</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={handleView}
                whileTap={reduced ? undefined : { scale: 0.93 }}
                className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-brand-700/20 hover:bg-brand-700/40 text-brand-300 transition-colors"
                aria-label={`Ver ${product.name}`}
              >
                Ver <ArrowRight className="w-2.5 h-2.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </LayerReveal>
  )
}
