import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { Promotion } from '@/types/booking'

export default async function PromotionsPage() {
  const supabase = await createClient()

  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  // Filter by date validity
  const now = new Date().toISOString().split('T')[0]
  const activePromotions = (promotions ?? []).filter(p => {
    const validFrom = p.valid_from ? new Date(p.valid_from).toISOString().split('T')[0] : null
    const validUntil = p.valid_until ? new Date(p.valid_until).toISOString().split('T')[0] : null

    const afterStart = !validFrom || validFrom <= now
    const beforeEnd = !validUntil || validUntil >= now

    return afterStart && beforeEnd
  }) as Promotion[]

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Promoções em Destaque
          </h1>
          <p className="text-zinc-400 text-lg">
            Acompanhe nossas ofertas exclusivas
          </p>
        </div>

        {/* Promotions Grid */}
        {activePromotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePromotions.map(promo => (
              <div
                key={promo.id}
                className="group rounded-2xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-colors bg-zinc-900 hover:bg-zinc-900/80"
              >
                {/* Image */}
                {promo.image_url && (
                  <div className="relative w-full h-48 bg-zinc-800 overflow-hidden">
                    <Image
                      src={promo.image_url}
                      alt={promo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {promo.title}
                  </h2>

                  {promo.description && (
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                      {promo.description}
                    </p>
                  )}

                  {/* Validity */}
                  {(promo.valid_from || promo.valid_until) && (
                    <div className="text-xs text-brand-300 bg-brand-900/30 rounded-lg px-3 py-2 inline-block">
                      {promo.valid_from && `De ${new Date(promo.valid_from).toLocaleDateString('pt-BR')}`}
                      {promo.valid_from && promo.valid_until && ' até '}
                      {promo.valid_until && new Date(promo.valid_until).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">
              Nenhuma promoção disponível no momento
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
