'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Package, MessageSquare } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { getUserOrders } from '@/lib/supabase/clientQueries'
import { LayerReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { PrintCtaLink } from '@/components/ui/PrintCtaLink'
import { OrderHistoryCard } from '@/components/orders/OrderHistoryCard'
import type { Order } from '@/types'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511989525014'

export default function MeusPedidosPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [fetching, setFetching] = useState(false)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/')
    }
  }, [loading, isAuthenticated, router])

  // Fetch orders once authenticated
  useEffect(() => {
    if (!user) return
    setFetching(true)
    getUserOrders(user.id).then((data) => {
      setOrders(data)
      setFetching(false)
    })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-300 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <LayerReveal>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Meus Pedidos</h1>
              <p className="text-zinc-400 text-sm">Acompanhe o status dos seus pedidos</p>
            </div>
          </div>
        </div>

        {/* Callout — pedidos personalizados */}
        <div className="mb-6 flex gap-3 items-start bg-brand-700/10 border border-brand-700/30 rounded-2xl p-4">
          <MessageSquare className="w-4 h-4 text-brand-300 shrink-0 mt-0.5" />
          <p className="text-zinc-300 text-sm leading-relaxed">
            <span className="font-semibold text-brand-300">Pedidos personalizados</span> são
            acompanhados diretamente pelo WhatsApp.{' '}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-300 hover:text-brand-200 underline underline-offset-2 transition-colors"
            >
              Fale conosco →
            </a>
          </p>
        </div>

        {/* Order list */}
        {fetching ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-300 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 mx-auto mb-3 text-zinc-600 opacity-50" />
            <p className="text-zinc-400 mb-6">Você ainda não fez nenhum pedido.</p>
            <PrintCtaLink href="/catalog">
              Explorar catálogo
            </PrintCtaLink>
          </div>
        ) : (
          <StaggerGroup className="space-y-3">
            {orders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} />
            ))}
          </StaggerGroup>
        )}
      </LayerReveal>
    </div>
  )
}
