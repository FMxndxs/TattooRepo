'use client'

import { useState } from 'react'
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react'
import { ServiceForm } from './ServiceForm'
import { deleteServiceAction, toggleServiceActiveAction } from '@/app/actions/services'
import { formatBRL } from '@/lib/utils/formatters'
import type { Service } from '@/types/booking'

interface ServicesTableProps {
  services: Service[]
}

export function ServicesTable({ services: initialServices }: ServicesTableProps) {
  const [services, setServices] = useState(initialServices)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleteError(null)
    setDeletingId(id)

    const result = await deleteServiceAction(id)
    if (!result.success) {
      setDeleteError(result.error || 'Erro ao deletar')
      setDeletingId(null)
      return
    }

    setServices((prev) => prev.filter((s) => s.id !== id))
    setDeletingId(null)
  }

  async function handleToggleActive(service: Service) {
    const result = await toggleServiceActiveAction(service.id, service.is_active)
    if (result.success) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, is_active: !s.is_active } : s
        )
      )
    }
  }

  function handleEditClose() {
    setEditingService(null)
    setShowForm(false)
  }

  function handleSuccess() {
    setServices((prev) =>
      editingService
        ? prev.map((s) => (s.id === editingService.id ? editingService : s))
        : prev
    )
  }

  return (
    <div className="space-y-4">
      {showForm && !editingService && (
        <ServiceForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            // Re-fetch via revalidatePath
            window.location.reload()
          }}
        />
      )}

      {editingService && (
        <ServiceForm
          service={editingService}
          onClose={handleEditClose}
          onSuccess={() => {
            window.location.reload()
          }}
        />
      )}

      {!showForm && !editingService && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      )}

      {services.length === 0 ? (
        <div className="py-16 text-center text-zinc-500">
          <p>Nenhum serviço cadastrado. Crie um para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-bold">{service.name}</h3>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                    {service.slug}
                  </span>
                  {service.is_active && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">
                      Ativo
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-zinc-400 mb-3">{service.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                  <span>⏱ {service.duration_min} min</span>
                  <span>💰 Sinal: {formatBRL(service.deposit_amount)}</span>
                  {service.price_from && <span>Preço a partir de: {formatBRL(service.price_from)}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(service)}
                  title={service.is_active ? 'Desativar' : 'Ativar'}
                  className={`p-2 rounded-lg transition-colors ${
                    service.is_active
                      ? 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {service.is_active ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                  className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteError && (
        <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
          {deleteError}
        </div>
      )}
    </div>
  )
}
