'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { PortfolioForm } from './PortfolioForm'
import { deletePortfolioItem } from '@/app/actions/portfolio'
import type { PortfolioItem } from '@/types/booking'

interface PortfolioPanelProps {
  items: PortfolioItem[]
}

export function PortfolioPanel({ items: initialItems }: PortfolioPanelProps) {
  const [items, setItems] = useState(initialItems)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const editing = editingId ? items.find(i => i.id === editingId) ?? null : null

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja deletar este trabalho?')) return

    setDeleting(id)
    const result = await deletePortfolioItem(id)
    setDeleting(null)

    if (result.success) {
      setItems(items.filter(i => i.id !== id))
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingId(null)
    // Data will be revalidated server-side
    window.location.reload()
  }

  if (showForm || editingId) {
    return (
      <PortfolioForm
        item={editing}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false)
          setEditingId(null)
        }}
      />
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-zinc-400 mb-4">Nenhum trabalho no portfólio ainda</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar trabalho
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar trabalho
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group"
          >
            {/* Image */}
            <div className="relative w-full aspect-square bg-zinc-800 overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.title || 'Portfolio item'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setEditingId(item.id)}
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-red-900/30 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              {item.title && (
                <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
              )}
              {(item.style || item.body_placement) && (
                <p className="text-xs text-zinc-400 mt-1">
                  {[item.style, item.body_placement].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
