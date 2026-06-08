'use client'

import { useState, useRef } from 'react'
import { Loader2, CheckCircle2, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { settingsSchema } from '@/lib/validations/settings'
import type { FreightConfig } from '@/lib/utils/freight'

interface FreightSettingsFormProps {
  initialConfig: FreightConfig & { hq_cep?: string | null; hq_label?: string | null }
}

const inputCls =
  'w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors'
const labelCls = 'block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide'
const errorCls = 'text-red-400 text-xs mt-1'

export function FreightSettingsForm({ initialConfig }: FreightSettingsFormProps) {
  const [cep, setCep] = useState(initialConfig.hq_cep ?? '')
  const [perKm, setPerKm] = useState(String(initialConfig.perKm))
  const [radiusKm, setRadiusKm] = useState(String(initialConfig.radiusKm))

  // Estado do geocode do CEP
  const [resolving, setResolving] = useState(false)
  const [resolvedLabel, setResolvedLabel] = useState<string | null>(initialConfig.hq_label ?? null)
  const [resolvedCoords, setResolvedCoords] = useState<{ lat: number; lng: number } | null>(
    initialConfig.hqCoords
  )
  const [geocodeError, setGeocodeError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Estado do save
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function handleCepChange(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    setCep(digits)
    setResolvedLabel(null)
    setResolvedCoords(null)
    setGeocodeError(null)

    if (digits.length !== 8) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setResolving(true)
      try {
        const res = await fetch(`/api/geocode?cep=${digits}`)
        if (!res.ok) {
          setGeocodeError('CEP não encontrado — verifique e tente novamente.')
          return
        }
        const data = await res.json()
        if (!data.coords) {
          setGeocodeError('Não foi possível obter coordenadas para este CEP.')
          return
        }
        const { lat, lng } = data.coords
        const city = data.address?.city ?? ''
        const state = data.address?.state ?? ''
        setResolvedCoords({ lat, lng })
        setResolvedLabel(city && state ? `${city} — ${state}` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        setGeocodeError(null)
      } catch {
        setGeocodeError('Erro ao consultar CEP. Tente novamente.')
      } finally {
        setResolving(false)
      }
    }, 500)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaveError(null)
    setSaveSuccess(false)
    setFieldErrors({})

    // Validação Zod
    const parsed = settingsSchema.safeParse({
      hq_cep: cep,
      freight_per_km: parseFloat(perKm.replace(',', '.')),
      delivery_radius_km: parseFloat(radiusKm.replace(',', '.')),
    })

    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        errs[key] = issue.message
      }
      setFieldErrors(errs)
      return
    }

    if (!resolvedCoords) {
      setFieldErrors({ hq_cep: geocodeError ?? 'Aguarde a resolução do CEP ou verifique o número.' })
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('settings')
        .update({
          hq_cep: parsed.data.hq_cep,
          hq_lat: resolvedCoords.lat,
          hq_lng: resolvedCoords.lng,
          hq_label: resolvedLabel ?? null,
          freight_per_km: parsed.data.freight_per_km,
          delivery_radius_km: parsed.data.delivery_radius_km,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1)

      if (error) {
        setSaveError('Erro ao salvar configurações. Tente novamente.')
        return
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-xl">

      {/* CEP da sede */}
      <div>
        <label htmlFor="hq_cep" className={labelCls}>CEP da sede (local base)</label>
        <input
          id="hq_cep"
          placeholder="00000000"
          inputMode="numeric"
          maxLength={8}
          value={cep}
          onChange={(e) => handleCepChange(e.target.value)}
          className={inputCls}
        />
        {fieldErrors.hq_cep && <p className={errorCls}>{fieldErrors.hq_cep}</p>}

        {/* Preview de geocodificação */}
        <div className="mt-2 min-h-[20px]">
          {resolving && (
            <span className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              Consultando CEP...
            </span>
          )}
          {!resolving && resolvedCoords && resolvedLabel && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs">
              <MapPin className="w-3 h-3 shrink-0" />
              {resolvedLabel} · {resolvedCoords.lat.toFixed(4)}, {resolvedCoords.lng.toFixed(4)}
            </span>
          )}
          {!resolving && geocodeError && (
            <span className="text-red-400 text-xs">{geocodeError}</span>
          )}
        </div>
      </div>

      {/* R$/km */}
      <div>
        <label htmlFor="freight_per_km" className={labelCls}>Valor por km (R$)</label>
        <input
          id="freight_per_km"
          placeholder="2.50"
          inputMode="decimal"
          value={perKm}
          onChange={(e) => setPerKm(e.target.value)}
          className={inputCls}
        />
        {fieldErrors.freight_per_km && <p className={errorCls}>{fieldErrors.freight_per_km}</p>}
        <p className="text-zinc-500 text-xs mt-1">
          Valor cobrado por km de distância em linha reta até o cliente.
        </p>
      </div>

      {/* Raio máximo */}
      <div>
        <label htmlFor="delivery_radius_km" className={labelCls}>Raio máximo de entrega (km)</label>
        <input
          id="delivery_radius_km"
          placeholder="8"
          inputMode="decimal"
          value={radiusKm}
          onChange={(e) => setRadiusKm(e.target.value)}
          className={inputCls}
        />
        {fieldErrors.delivery_radius_km && <p className={errorCls}>{fieldErrors.delivery_radius_km}</p>}
        <p className="text-zinc-500 text-xs mt-1">
          Pedidos fora desse raio são encaminhados para retirada ou Uber Flash / 99 Entregas.
        </p>
      </div>

      {/* Feedback global */}
      {saveError && (
        <p className="text-red-400 text-sm">{saveError}</p>
      )}
      {saveSuccess && (
        <p className="flex items-center gap-1.5 text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Configurações salvas com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={saving || resolving}
        className="bg-brand-700 hover:bg-brand-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-full transition-colors text-sm"
      >
        {saving ? 'Salvando...' : 'Salvar configurações'}
      </button>
    </form>
  )
}
