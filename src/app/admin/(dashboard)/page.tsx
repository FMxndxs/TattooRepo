import { createClient } from '@/lib/supabase/server'
import { Calendar, MessageSquare, Sparkles, Image as ImageIcon } from 'lucide-react'
import { StaggerGroup } from '@/components/ui/MotionPrimitives'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: bookingCount },
    { count: pendingCustomCount },
    { count: activePromotionCount },
    { count: portfolioCount },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('custom_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('promotions').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Agendamentos', value: bookingCount ?? 0, icon: Calendar, color: 'text-brand-300' },
    { label: 'Orçamentos pendentes', value: pendingCustomCount ?? 0, icon: MessageSquare, color: 'text-brand-300' },
    { label: 'Promoções ativas', value: activePromotionCount ?? 0, icon: Sparkles, color: 'text-brand-300' },
    { label: 'Itens no portfólio', value: portfolioCount ?? 0, icon: ImageIcon, color: 'text-brand-300' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-zinc-400 mt-1">Bem-vindo ao painel da Kadu Freitas Tattoo</p>
      </div>

      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 hover:border-brand-700/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm leading-tight">{label}</span>
              <Icon className={`w-5 h-5 shrink-0 ${color}`} />
            </div>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </StaggerGroup>
    </div>
  )
}
