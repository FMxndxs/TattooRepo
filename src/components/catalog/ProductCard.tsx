import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { formatBRL } from '@/lib/utils/formatters'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0]

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-500/60 transition-all duration-300">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {product.is_featured && (
            <span className="bg-brand-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Destaque
            </span>
          )}
          {!product.is_available && (
            <span className="bg-zinc-700 text-zinc-300 text-xs font-semibold px-2 py-1 rounded-full">
              Indisponível
            </span>
          )}
        </div>

        {/* Imagem */}
        <div className="aspect-square relative bg-zinc-800 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-zinc-400 text-xs line-clamp-2 mb-3">{product.description}</p>
          )}

          {/* Cores */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mb-3">
              {product.colors.slice(0, 5).map((color) => (
                <span
                  key={color.id}
                  title={color.name}
                  className="w-4 h-4 rounded-full border border-zinc-600"
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
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
              Ver produto
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
