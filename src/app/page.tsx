import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, Palette, Package } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/supabase/queries'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts().catch(() => [])

  return (
    <div>
      <section className="relative overflow-hidden bg-zinc-950 pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Bambu Lab A1 — Qualidade profissional
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Impressão 3D que<br />
            <span className="text-orange-500">transforma ideias</span><br />
            em realidade
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            Produtos únicos impressos com filamento de alta qualidade. Escolha entre nossas cores, personalize o tamanho ou traga sua própria ideia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/catalog" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-full transition-colors">
              Ver catálogo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/custom-order" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Projeto personalizado
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Package, title: 'Alta qualidade', desc: 'Impressora Bambu Lab A1 com precisão de 0.05mm' },
              { icon: Palette, title: 'Múltiplas cores', desc: 'Mais de 10 cores de filamento disponíveis' },
              { icon: Sparkles, title: 'Personalização', desc: 'Traga sua ideia e a imprimimos para você' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p className="text-zinc-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Produtos em destaque</h2>
              <Link href="/catalog" className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Tem uma ideia em mente?</h2>
          <p className="text-zinc-400 mb-8">Envie sua referência e receba um orçamento via WhatsApp em minutos.</p>
          <Link href="/custom-order" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors text-lg">
            <Sparkles className="w-5 h-5" />
            Solicitar orçamento
          </Link>
        </div>
      </section>
    </div>
  )
}
