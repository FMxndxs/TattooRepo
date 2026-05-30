'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { StockToggle } from './StockToggle'
import { createClient } from '@/lib/supabase/browser'
import type { Color } from '@/types'

interface ColorManagerProps {
  colors: Color[]
  onRefresh: () => void
}

export function ColorManager({ colors, onRefresh }: ColorManagerProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newHex, setNewHex] = useState('#6a2ba8')
  const [saveError, setSaveError] = useState<string | null>(null)

  async function toggleColor(color: Color) {
    setTogglingId(color.id)
    const supabase = createClient()
    await supabase
      .from('colors')
      .update({ is_available: !color.is_available })
      .eq('id', color.id)
    setTogglingId(null)
    onRefresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover esta cor? Produtos que a usam perderão o vínculo.')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('colors').delete().eq('id', id)
    setDeletingId(null)
    onRefresh()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaveError(null)
    const name = newName.trim()
    if (!name) return
    const supabase = createClient()
    const { error } = await supabase.from('colors').insert({ name, hex_code: newHex, is_available: true })
    if (error) {
      setSaveError('Erro ao salvar cor.')
      return
    }
    setNewName('')
    setNewHex('#6a2ba8')
    setAdding(false)
    onRefresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">{colors.length} cores</h2>
        <button
          onClick={() => { setAdding((v) => !v); setSaveError(null) }}
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-500 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova cor
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form
          onSubmit={handleAdd}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-5 flex flex-wrap items-end gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-zinc-400 text-xs font-medium">Nome</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex.: Azul Royal"
              required
              className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3 py-2 text-sm w-44 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-400 text-xs font-medium">Cor (hex)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-zinc-800 cursor-pointer p-0.5"
              />
              <input
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
                placeholder="#000000"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3 py-2 text-sm w-28 font-mono focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <button
              type="submit"
              className="bg-brand-700 hover:bg-brand-500 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setSaveError(null) }}
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
          {saveError && <p className="w-full text-red-400 text-xs">{saveError}</p>}
        </form>
      )}

      {/* Color grid */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-zinc-400 text-xs font-semibold px-4 py-3">Cor</th>
              <th className="text-left text-zinc-400 text-xs font-semibold px-4 py-3 hidden sm:table-cell">Hex</th>
              <th className="text-left text-zinc-400 text-xs font-semibold px-4 py-3">Disponível</th>
              <th className="text-right text-zinc-400 text-xs font-semibold px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full shrink-0 border border-zinc-700"
                      style={{ backgroundColor: color.hex_code }}
                    />
                    <span className="text-white text-sm font-medium">{color.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-zinc-500 text-xs font-mono">{color.hex_code}</span>
                </td>
                <td className="px-4 py-3">
                  <StockToggle
                    available={color.is_available}
                    onChange={() => toggleColor(color)}
                    disabled={togglingId === color.id}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(color.id)}
                      disabled={deletingId === color.id}
                      className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Remover cor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {colors.length === 0 && (
          <div className="py-12 text-center text-zinc-500 text-sm">
            Nenhuma cor cadastrada.
          </div>
        )}
      </div>
    </div>
  )
}
