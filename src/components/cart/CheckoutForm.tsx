'use client'

import { useState, useRef } from 'react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Truck, Store, AlertCircle } from 'lucide-react'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout'
import { formatBRL } from '@/lib/utils/formatters'
import type { CustomerInfo, DeliveryQuote } from '@/types'

interface CheckoutFormProps {
  onSubmit: (data: CustomerInfo) => void
  onDeliveryQuote?: (quote: DeliveryQuote | null) => void
  loading?: boolean
}

const inputCls =
  'w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors'
const labelCls = 'block text-white text-sm font-medium mb-1.5'
const errorCls = 'text-red-400 text-xs mt-1'

export function CheckoutForm({ onSubmit, onDeliveryQuote, loading = false }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '', phone: '', cep: '', number: '', street: '', neighborhood: '', city: '',
    },
  })

  const { field: cepField } = useController({ name: 'cep', control })

  const [quote, setQuote] = useState<DeliveryQuote | null>(null)
  const [loadingFreight, setLoadingFreight] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function propagateQuote(q: DeliveryQuote | null) {
    setQuote(q)
    onDeliveryQuote?.(q)
  }

  function handleCepChange(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    cepField.onChange(digits)

    if (digits.length !== 8) {
      propagateQuote(null)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoadingFreight(true)
      try {
        const res = await fetch(`/api/freight?cep=${digits}`)
        if (!res.ok) throw new Error()
        const data: DeliveryQuote = await res.json()
        propagateQuote(data)
        if (data.address) {
          if (data.address.street)       setValue('street',       data.address.street,       { shouldValidate: true })
          if (data.address.neighborhood) setValue('neighborhood', data.address.neighborhood, { shouldValidate: true })
          if (data.address.city)         setValue('city',         data.address.city,         { shouldValidate: true })
        }
      } catch {
        propagateQuote(null)
      } finally {
        setLoadingFreight(false)
      }
    }, 400)
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as CustomerInfo))} noValidate className="space-y-4">

      {/* Nome */}
      <div>
        <label htmlFor="name" className={labelCls}>Nome</label>
        <input id="name" placeholder="Seu nome completo" {...register('name')} className={inputCls} />
        {errors.name && <p role="alert" className={errorCls}>{errors.name.message}</p>}
      </div>

      {/* Telefone */}
      <div>
        <label htmlFor="phone" className={labelCls}>Telefone</label>
        <input id="phone" placeholder="(11) 98765-4321" {...register('phone')} className={inputCls} />
        {errors.phone && <p role="alert" className={errorCls}>{errors.phone.message}</p>}
      </div>

      {/* CEP + Número */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cep" className={labelCls}>
            CEP
            {loadingFreight && <Loader2 className="inline w-3 h-3 ml-1.5 animate-spin text-brand-300" />}
          </label>
          <input
            id="cep"
            placeholder="00000000"
            inputMode="numeric"
            maxLength={8}
            name={cepField.name}
            ref={cepField.ref}
            value={cepField.value}
            onBlur={cepField.onBlur}
            onChange={(e) => handleCepChange(e.target.value)}
            className={inputCls}
          />
          {errors.cep && <p role="alert" className={errorCls}>{errors.cep.message}</p>}
        </div>
        <div>
          <label htmlFor="number" className={labelCls}>Número</label>
          <input id="number" placeholder="123" {...register('number')} className={inputCls} />
          {errors.number && <p role="alert" className={errorCls}>{errors.number.message}</p>}
        </div>
      </div>

      {/* Rua */}
      <div>
        <label htmlFor="street" className={labelCls}>Rua</label>
        <input id="street" placeholder="Preenchido pelo CEP" {...register('street')} className={inputCls} />
        {errors.street && <p role="alert" className={errorCls}>{errors.street.message}</p>}
      </div>

      {/* Bairro + Cidade */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="neighborhood" className={labelCls}>Bairro</label>
          <input id="neighborhood" placeholder="Preenchido pelo CEP" {...register('neighborhood')} className={inputCls} />
          {errors.neighborhood && <p role="alert" className={errorCls}>{errors.neighborhood.message}</p>}
        </div>
        <div>
          <label htmlFor="city" className={labelCls}>Cidade</label>
          <input id="city" placeholder="Preenchida pelo CEP" {...register('city')} className={inputCls} />
          {errors.city && <p role="alert" className={errorCls}>{errors.city.message}</p>}
        </div>
      </div>

      {/* Painel de entrega */}
      {quote && <DeliveryPanel quote={quote} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors text-base mt-2"
      >
        {loading ? 'Processando...' : 'Finalizar pedido via WhatsApp'}
      </button>
    </form>
  )
}

function DeliveryPanel({ quote }: { quote: DeliveryQuote }) {
  if (quote.mode === 'delivery') {
    return (
      <div className="rounded-xl bg-green-950/50 border border-green-800 p-4 flex gap-3 items-start">
        <Truck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-green-300 text-sm font-semibold">Entrega disponível ✓</p>
          <p className="text-green-400/80 text-xs mt-0.5">
            {quote.distanceKm?.toFixed(1)} km da sede ·{' '}
            Frete{' '}
            <span className="font-bold text-green-300">{formatBRL(quote.freight!)}</span>
            {' '}(R$ 2,50/km)
          </p>
        </div>
      </div>
    )
  }

  if (quote.mode === 'pickup_or_courier') {
    return (
      <div className="rounded-xl bg-amber-950/50 border border-amber-800 p-4 flex gap-3 items-start">
        <Store className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-300 text-sm font-semibold">Fora da área de entrega (8 km)</p>
          <p className="text-amber-400/80 text-xs mt-0.5">
            Você pode <strong className="text-amber-300">retirar na sede</strong> (centro histórico
            de Santana de Parnaíba) ou solicitar{' '}
            <strong className="text-amber-300">Uber Flash / 99 Entregas</strong> — valor a combinar
            no WhatsApp.
          </p>
        </div>
      </div>
    )
  }

  // mode === 'unknown'
  return (
    <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 p-4 flex gap-3 items-start">
      <AlertCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-zinc-300 text-sm font-semibold">Frete a combinar</p>
        <p className="text-zinc-400/80 text-xs mt-0.5">
          Não conseguimos calcular o frete automaticamente — confirmaremos o valor no WhatsApp.
        </p>
      </div>
    </div>
  )
}
