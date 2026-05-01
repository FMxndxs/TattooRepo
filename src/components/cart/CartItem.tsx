'use client'

import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'
import type { CartItem as CartItemType } from '@/types'
import { formatBRL } from '@/lib/utils/formatters'

interface CartItemProps {
  item: CartItemType
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const primaryImage = item.product.images?.find((img) => img.is_primary) ?? item.product.images?.[0]
  const subtotal = item.unit_price * item.quantity

  return (
    <div className="flex gap-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
      {/* Imagem */}
      <div className="w-20 h-20 relative bg-zinc-800 rounded-xl overflow-hidden shrink-0">
        {primaryImage ? (
          <Image src={primaryImage.url} alt={item.product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm truncate">{item.product.name}</h3>

        {item.selected_color && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-3 h-3 rounded-full border border-zinc-600"
              style={{ backgroundColor: item.selected_color.hex_code }}
            />
            <span className="text-zinc-400 text-xs">{item.selected_color.name}</span>
          </div>
        )}

        {item.selected_size && (
          <span className="text-zinc-400 text-xs mt-0.5 block">{item.selected_size.label}</span>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Controle de quantidade */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              aria-label="-"
              className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              aria-label="+"
              className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-brand-300 font-bold text-sm">{formatBRL(subtotal)}</span>
        </div>
      </div>

      {/* Remover */}
      <button
        onClick={onRemove}
        aria-label="remover"
        className="p-2 text-zinc-500 hover:text-red-400 transition-colors self-start"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
