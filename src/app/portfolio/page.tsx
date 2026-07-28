import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { PortfolioItem } from '@/types/booking'

export default async function PortfolioPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Portfólio
          </h1>
          <p className="text-zinc-400 text-lg">
            Confira alguns dos nossos trabalhos realizados
          </p>
        </div>

        {/* Gallery Grid */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(items as PortfolioItem[]).map(item => (
              <div
                key={item.id}
                className="group rounded-2xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10 bg-zinc-900"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-zinc-800 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title || 'Portfolio work'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Caption Overlay */}
                {(item.title || item.style) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    {item.title && (
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.title}
                      </h3>
                    )}
                    {item.style && (
                      <p className="text-sm text-brand-300">
                        {item.style}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">
              Portfólio em construção
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
