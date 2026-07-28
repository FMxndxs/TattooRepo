'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react'
import { PromotionForm } from './PromotionForm'
import { deletePromotion, togglePromotionActive } from '@/app/actions/promotions'
import type { Promotion } from '@/types/booking'

interface PromotionsPanelProps {
  promotions: Promotion[]
}

export function PromotionsPanel({ promotions: initialPromotions }: PromotionsPanelProps) {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const editing = editingId ? promotions.find(p => p.id === editingId) ?? null : null

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja deletar esta promoção?')) return

    setDeleting(id)
    const result = await deletePromotion(id)
    setDeleting(null)

    if (result.success) {
      setPromotions(promotions.filter(p => p.id !== id))
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const result = await togglePromotionActive(id, !currentActive)
    if (result.success) {
      setPromotions(promotions.map(p =>
        p.id === id ? { ...p, is_active: !currentActive } : p
      ))
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
      <PromotionForm
        promotion={editing}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false)
          setEditingId(null)
        }}
      />
    )
  }

  if (promotions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-zinc-400 mb-4">Nenhuma promoção criada ainda</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Criar promoção
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
          Criar promoção
        </button>
      </div>

      <div className="grid gap-4">
        {promotions.map(promotion => (
          <div
            key={promotion.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-start hover:border-zinc-700 transition-colors"
          >
            {/* Image Thumbnail */}
            {promotion.image_url && (
              <div className="w-20 h-20 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                <Image
                  src={promotion.image_url}
                  alt={promotion.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">{promotion.title}</h3>
              {promotion.description && (
                <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{promotion.description}</p>
              )}
              {(promotion.valid_from || promotion.valid_until) && (
                <p className="text-xs text-zinc-500 mt-2">
                  {promotion.valid_from && `De ${new Date(promotion.valid_from).toLocaleDateString('pt-BR')}`}
                  {promotion.valid_from && promotion.valid_until && ' até '}
                  {promotion.valid_until && new Date(promotion.valid_until).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleActive(promotion.id, promotion.is_active)}
                title={promotion.is_active ? 'Desativar' : 'Ativar'}
                className={`p-2 rounded-lg transition-colors ${
                  promotion.is_active
                    ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                    : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                }`}
              >
                {promotion.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditingId(promotion.id)}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(promotion.id)}
                disabled={deleting === promotion.id}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-red-900/30 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
