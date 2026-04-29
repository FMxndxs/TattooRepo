'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { StockToggle } from './StockToggle'
import { formatBRL } from '@/lib/utils/formatters'
import { createClient } from '@/lib/supabase/browser'
import type { Product } from '@/types'

interface ProductTableProps {
  products: Product[]
  onRefresh: () => void
}

export function ProductTable({ products, onRefresh }: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function toggleAvailability(product: Product) {
    const supabase = createClient()
    await supabase
      .from('products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id)
    onRefresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setDeletingId(null)
    onRefresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">{products.length} produtos</h2>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-zinc-400 text-xs font-semibold px-4 py-3">Produto</th>
              <th className="text-left text-zinc-400 text-xs font-semibold px-4 py-3">Preço</th>
              <th className="text-left text-zinc-400 text-xs font-semibold px-4 py-3 hidden md:table-cell">Categoria</th>
              <th className="text-left text-zinc-400 text-xs font-semibold px-4 py-3">Disponível</th>
              <th className="text-right text-zinc-400 text-xs font-semibold px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white text-sm font-medium">{product.name}</p>
                    <p className="text-zinc-500 text-xs font-mono">{product.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-orange-400 font-semibold text-sm">{formatBRL(product.price)}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-zinc-400 text-xs">{product.category?.name ?? '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <StockToggle
                    available={product.is_available}
                    onChange={() => toggleAvailability(product)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            <p className="text-sm">Nenhum produto cadastrado.</p>
            <Link href="/admin/products/new" className="text-orange-400 text-sm hover:underline mt-1 block">
              Criar primeiro produto
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
