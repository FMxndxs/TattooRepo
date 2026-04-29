import { createClient } from '@/lib/supabase/server'
import { Package, MessageSquare, Eye, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [{ count: productCount }, { count: orderCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('custom_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const stats = [
    { label: 'Produtos cadastrados', value: productCount ?? 0, icon: Package, color: 'text-orange-400' },
    { label: 'Pedidos personalizados pendentes', value: orderCount ?? 0, icon: MessageSquare, color: 'text-blue-400' },
    { label: 'Categorias', value: 5, icon: Eye, color: 'text-green-400' },
    { label: 'Cores disponíveis', value: 10, icon: TrendingUp, color: 'text-purple-400' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-zinc-400 mt-1">Bem-vindo ao painel da Imagination 3D</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
