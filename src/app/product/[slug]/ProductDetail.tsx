'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PrintLineHover } from '@/components/ui/MotionPrimitives'
import { formatBRL } from '@/lib/utils/formatters'
import type { Product, Color } from '@/types'

export function ProductDetail({ product }: { product: Product }) {
  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0]
  const [selectedColor, setSelectedColor] = useState<Color | null>(product.colors?.[0] ?? null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 md:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-12">
        {/* Imagem */}
        <PrintLineHover className="aspect-square bg-zinc-900 rounded-2xl border border-zinc-800 shadow-[0_20px_50px_-28px_rgba(67,19,112,0.35)]">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </PrintLineHover>

        {/* Info */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-wider mb-2">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{product.name}</h1>

          {product.description && (
            <p className="text-zinc-400 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Referência MakerWorld */}
          {product.makerworld_url && (
            <div className="text-xs text-zinc-500 border border-zinc-800 rounded-xl px-4 py-3 bg-zinc-900/50 mb-4">
              Imagem meramente ilustrativa. Modelo original disponível em{' '}
              <a
                href={product.makerworld_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-300 hover:underline"
              >
                MakerWorld ↗
              </a>
              . Vendemos o objeto físico impresso, não o arquivo digital.
            </div>
          )}

          {/* Seleção de cor */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-white font-semibold text-sm mb-3">
                Cor: <span className="text-brand-300">{selectedColor?.name ?? 'Nenhuma'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor?.id === color.id
                        ? 'border-brand-500 scale-110'
                        : 'border-zinc-600 hover:border-zinc-400'
                    }`}
                    style={{ backgroundColor: color.hex_code }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto space-y-3">
            <Link
              href="/agendar?service=flash"
              className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-600 text-white font-semibold py-3 rounded-full transition-colors text-sm"
            >
              Reservar esta Flash
            </Link>
            <a
              href={`https://wa.me/5511989525014?text=${encodeURIComponent(`Olá! Tenho interesse nesta flash: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-full transition-colors text-sm"
            >
              Esclarecer dúvidas no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
