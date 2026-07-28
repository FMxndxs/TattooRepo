import { createClient } from '@/lib/supabase/server'
import { PortfolioPanel } from '@/components/admin/PortfolioPanel'
import type { PortfolioItem } from '@/types/booking'

export default async function AdminPortfolioPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Portfólio</h1>
        <p className="text-zinc-400 mt-1">Galeria de trabalhos realizados</p>
      </div>

      <PortfolioPanel items={(items ?? []) as PortfolioItem[]} />
    </div>
  )
}
