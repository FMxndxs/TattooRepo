import { createClient } from '@/lib/supabase/server'
import { Package, MessageSquare, Tag, Palette, ShoppingBag } from 'lucide-react'
import { StaggerGroup } from '@/components/ui/MotionPrimitives'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: productCount },
    { count: pendingCustomCount },
    { count: categoryCount },
    { count: colorCount },
    { count: ordersThisMonth },
    { count: customThisMonth },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('custom_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('colors').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
    supabase.from('custom_orders').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
  ])

  const pedidosMes = (ordersThisMonth ?? 0) + (customThisMonth ?? 0)

  const stats = [
    { label: 'Produtos cadastrados', value: productCount ?? 0, icon: Package, color: 'text-brand-300' },
    { label: 'Pedidos custom pendentes', value: pendingCustomCount ?? 0, icon: MessageSquare, color: 'text-brand-300' },
    { label: 'Categorias', value: categoryCount ?? 0, icon: Tag, color: 'text-brand-300' },
    { label: 'Cores disponíveis', value: colorCount ?? 0, icon: Palette, color: 'text-brand-300' },
    { label: 'Pedidos este mês', value: pedidosMes, icon: ShoppingBag, color: 'text-brand-300' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-zinc-400 mt-1">Bem-vindo ao painel da Imagination 3D</p>
      </div>

      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
