import { createClient } from '@/lib/supabase/server'
import { PromotionsPanel } from '@/components/admin/PromotionsPanel'
import type { Promotion } from '@/types/booking'

export default async function AdminPromotionsPage() {
  const supabase = await createClient()

  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Promoções</h1>
        <p className="text-zinc-400 mt-1">Gerencie as promoções exibidas no site</p>
      </div>

      <PromotionsPanel promotions={(promotions ?? []) as Promotion[]} />
    </div>
  )
}
