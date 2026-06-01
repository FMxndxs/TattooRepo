'use client'

import { useState } from 'react'
import { Sparkles, CheckCircle } from 'lucide-react'
import { CustomOrderForm } from '@/components/custom-order/CustomOrderForm'
import { buildCustomOrderUrl } from '@/lib/utils/whatsapp'
import { createClient } from '@/lib/supabase/browser'
import { useAuth } from '@/lib/context/AuthContext'
import { useAuthGate } from '@/hooks/useAuthGate'
import type { CustomOrderFormData } from '@/lib/validations/customOrder'

export default function CustomOrderPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { profile } = useAuth()
  const { requireAuth } = useAuthGate()

  async function handleSubmit(data: CustomOrderFormData & { image_url: string | null }) {
    requireAuth(async () => {
      const customerName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Cliente'
      const customerPhone = profile?.phone ?? ''

      setLoading(true)
      try {
        const supabase = createClient()
        await supabase.from('custom_orders').insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          description: data.description,
          reference_url: data.reference_url ?? null,
          reference_image_url: data.image_url ?? null,
        })
      } catch {
        // falha silenciosa — WhatsApp ainda abre
      } finally {
        setLoading(false)
      }

      const url = buildCustomOrderUrl({
        name: customerName,
        phone: customerPhone,
        description: data.description,
        color_name: data.color_name,
        reference_url: data.reference_url ?? null,
        image_url: data.image_url ?? null,
      })

      window.open(url, '_blank')
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Solicitação enviada!</h1>
        <p className="text-zinc-400">
          Seu pedido foi enviado via WhatsApp. Responderemos em breve com o orçamento.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-brand-300 text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4" />
          Projeto personalizado
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Traga sua ideia</h1>
        <p className="text-zinc-400 leading-relaxed">
          Não encontrou o que precisa no catálogo? Descreva seu projeto, envie uma referência e receba um orçamento personalizado via WhatsApp.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8">
        <CustomOrderForm onSubmit={handleSubmit} loading={loading} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        {[
          { step: '1', text: 'Preencha o formulário' },
          { step: '2', text: 'Receba orçamento no WhatsApp' },
          { step: '3', text: 'Aprovado, imprimimos!' },
        ].map(({ step, text }) => (
          <div key={step} className="p-3">
            <div className="w-8 h-8 bg-brand-700/15 text-brand-300 font-bold rounded-full flex items-center justify-center mx-auto mb-2 text-sm">
              {step}
            </div>
            <p className="text-zinc-400 text-xs">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
