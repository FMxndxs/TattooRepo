'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, Palette, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { LayerReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { FilamentBackdrop } from '@/components/ui/FilamentBackdrop'
import { PrintCtaLink } from '@/components/ui/PrintCtaLink'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import type { Product } from '@/types'

function NozzleWarmBadge({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="inline-flex items-center gap-2 bg-brand-700/15 border border-brand-500/35 text-brand-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      animate={reduced ? undefined : { scale: [1, 1.032, 1] }}
      transition={{ duration: 2.65, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    import('@/lib/supabase/browser').then(({ createClient }) => {
      const supabase = createClient()
      supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*), colors:product_colors(color:colors(*))')
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(8)
        .then(({ data }) => {
          const mapped = (data ?? []).map((p) => ({
            ...p,
            colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [],
          })) as Product[]
          setFeatured(mapped)
        })
    })
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/20 via-brand-900/10 to-transparent" />
        <FilamentBackdrop />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LayerReveal delay={0}>
            <NozzleWarmBadge>
              <Zap className="w-3.5 h-3.5" aria-hidden />
              Bambu Lab A1 — Qualidade profissional
            </NozzleWarmBadge>
          </LayerReveal>

          <LayerReveal delay={0.08}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Impressão 3D que<br />
              <span className="text-brand-300">transforma ideias</span><br />
              em realidade
            </h1>
          </LayerReveal>

          <LayerReveal delay={0.16}>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
              Produtos únicos impressos com filamento de alta qualidade. Escolha entre nossas cores, personalize o tamanho ou traga sua própria ideia.
            </p>
          </LayerReveal>

          <LayerReveal delay={0.24}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <PrintCtaLink href="/catalog">
                Ver catálogo <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </PrintCtaLink>
              <PrintCtaLink href="/custom-order" variant="secondary">
                <Sparkles className="w-4 h-4 shrink-0 text-brand-300" aria-hidden />
                Projeto personalizado
              </PrintCtaLink>
            </div>
          </LayerReveal>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Package, title: 'Alta qualidade', desc: 'Impressora Bambu Lab A1 com precisão de 0.05mm' },
              { icon: Palette, title: 'Múltiplas cores', desc: 'Mais de 10 cores de filamento disponíveis' },
              { icon: Sparkles, title: 'Personalização', desc: 'Traga sua ideia e a imprimimos para você' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="w-10 h-10 bg-brand-700/15 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p className="text-zinc-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Produtos em destaque */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Produtos em destaque</h2>
              <Link href="/catalog" className="text-brand-300 hover:text-brand-200 text-sm font-medium flex items-center gap-1">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={featured} />
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <LayerReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Tem uma ideia em mente?</h2>
            <p className="text-zinc-400 mb-8">Envie sua referência e receba um orçamento via WhatsApp em minutos.</p>
            <PrintCtaLink href="/custom-order" className="!px-8 !py-4 text-lg">
              <Sparkles className="w-5 h-5 shrink-0" aria-hidden />
              Solicitar orçamento
            </PrintCtaLink>
          </LayerReveal>
        </div>
      </section>
    </div>
  )
}
