import Image from 'next/image'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { portfolioFilterOptions, filterPortfolioItems } from '@/lib/portfolio/filter'
import type { PortfolioItem } from '@/types/booking'

// ponytail: link do Instagram é placeholder — trocar pelo perfil real do estúdio.
const INSTAGRAM_URL = 'https://instagram.com/kadufreitastattoo'

interface PortfolioPageProps {
  searchParams: Promise<{ estilo?: string; local?: string }>
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { estilo, local } = await searchParams
  const supabase = await createClient()

  const { data } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const items = (data ?? []) as PortfolioItem[]

  // Dataset pequeno (galeria de um único estúdio) — filtrar em memória é mais
  // simples que refazer a query por combinação de filtro. Reavaliar se crescer muito.
  const { styles, placements } = portfolioFilterOptions(items)
  const filtered = filterPortfolioItems(items, { estilo, local })

  function filterHref(next: { estilo?: string; local?: string }) {
    const params = new URLSearchParams()
    const nextEstilo = next.estilo ?? estilo
    const nextLocal = next.local ?? local
    if (nextEstilo) params.set('estilo', nextEstilo)
    if (nextLocal) params.set('local', nextLocal)
    const qs = params.toString()
    return qs ? `/portfolio?${qs}` : '/portfolio'
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Portfólio
          </h1>
          <p className="text-zinc-400 text-lg mb-4">
            Confira alguns dos nossos trabalhos realizados
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-300 hover:text-brand-200 text-sm font-medium transition-colors"
          >
            <Camera className="w-4 h-4" />
            Ver mais no Instagram
          </a>
        </div>

        {/* Filtros */}
        {(styles.length > 0 || placements.length > 0) && (
          <div className="flex flex-col gap-3 mb-10 items-center">
            {styles.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href={filterHref({ estilo: undefined })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !estilo ? 'bg-brand-700 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Todos os estilos
                </Link>
                {styles.map((s) => (
                  <Link
                    key={s}
                    href={filterHref({ estilo: s === estilo ? undefined : s })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      estilo === s ? 'bg-brand-700 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            )}
            {placements.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href={filterHref({ local: undefined })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !local ? 'bg-brand-700 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Todos os locais
                </Link>
                {placements.map((p) => (
                  <Link
                    key={p}
                    href={filterHref({ local: p === local ? undefined : p })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                      local === p ? 'bg-brand-700 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gallery — grid denso estilo feed do Instagram */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden bg-zinc-900"
              >
                <Image
                  src={item.image_url}
                  alt={item.title || 'Trabalho do portfólio'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {(item.title || item.style || item.body_placement) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    {item.title && (
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {item.title}
                      </h3>
                    )}
                    {(item.style || item.body_placement) && (
                      <p className="text-xs text-brand-300">
                        {[item.style, item.body_placement].filter(Boolean).join(' · ')}
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
              {items.length === 0 ? 'Portfólio em construção' : 'Nenhum trabalho encontrado com esse filtro'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
