'use client'

import { useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, useSpring } from 'motion/react'
import type { Product } from '@/types'
import { formatBRL } from '@/lib/utils/formatters'
import { PrintLineHover } from '@/components/ui/MotionPrimitives'

interface ProductCardProps {
  product: Product
}

const springCfg = { stiffness: 340, damping: 32 }

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0]
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const rotateX = useSpring(0, springCfg)
  const rotateY = useSpring(0, springCfg)

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !ref.current) return
      const r = ref.current.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      rotateY.set((px - 0.5) * 14)
      rotateX.set((0.5 - py) * 12)
    },
    [reduced, rotateX, rotateY],
  )

  const onLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div style={{ perspective: reduced ? 'none' : '980px' }}>
        <motion.div
          ref={ref}
          style={{
            rotateX: reduced ? 0 : rotateX,
            rotateY: reduced ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="will-change-transform"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-500/65 transition-colors duration-300 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_50px_-24px_rgba(67,19,112,0.35)]">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              {product.is_featured && (
                <span className="bg-brand-700 text-white text-xs font-semibold px-2 py-1 rounded-full ring-1 ring-brand-400/35">
                  Destaque
                </span>
              )}
              {!product.is_available && (
                <span className="bg-zinc-700 text-zinc-300 text-xs font-semibold px-2 py-1 rounded-full">
                  Indisponível
                </span>
              )}
            </div>

            {/* Imagem + varreduras tipo extrusão */}
            <PrintLineHover className="aspect-square bg-zinc-800">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt ?? product.name}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.045]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-16 w-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </PrintLineHover>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-zinc-400 text-xs line-clamp-2 mb-3">{product.description}</p>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="flex gap-1 mb-3">
                  {product.colors.slice(0, 5).map((color) => (
                    <span
                      key={color.id}
                      title={color.name}
                      className="w-4 h-4 rounded-full border border-zinc-600 shadow-inner"
                      style={{ backgroundColor: color.hex_code }}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="text-zinc-500 text-xs">+{product.colors.length - 5}</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-brand-300 font-bold text-base">{formatBRL(product.price)}</span>
                <span className="text-xs text-brand-100/95 bg-brand-900/65 border border-brand-600/40 px-2.5 py-1 rounded-full">
                  Ver produto
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  )
}
