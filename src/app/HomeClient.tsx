'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Sparkles, ArrowRight, ChevronDown, Palette, Package, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { LayerReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { PrintCtaLink } from '@/components/ui/PrintCtaLink'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import type { Product } from '@/types'

// Cena 3D é client-only (three.js não roda no servidor) — chunk isolado,
// não bloqueia o first paint do texto/CTAs do hero.
const Hero3DPrinter = dynamic(
  () => import('@/components/ui/hero3d/Hero3DPrinter').then((mod) => mod.Hero3DPrinter),
  { ssr: false }
)

// Reveal do título "extrude" de baixo pra cima, mesma direção/qualidade de
// movimento da peça sendo "criada" no hero 3D — ver usePrintLoop.ts.
const HEADLINE_EASE = [0.22, 1, 0.36, 1] as const

// Segurança: se o bundle 3D falhar/demorar, revela o título mesmo assim depois
// desse prazo (bem maior que o ciclo natural de ~9s) em vez de ficar escondido pra sempre.
const REVEAL_FALLBACK_MS = 12000

const reviews = [
  {
    name: 'Lucas Ferreira',
    location: 'São Paulo, SP',
    rating: 5,
    text: 'Pedi um suporte de mesa personalizado e fiquei impressionado com a qualidade. Chegou rápido, bem embalado e encaixou perfeitamente. Com certeza vou pedir mais.',
  },
  {
    name: 'Mariana Costa',
    location: 'Campinas, SP',
    rating: 5,
    text: 'Mandei a referência pelo WhatsApp e em poucos minutos já tinha orçamento. O atendimento é excelente e o produto ficou idêntico ao que eu queria.',
  },
  {
    name: 'Rafael Souza',
    location: 'Santo André, SP',
    rating: 5,
    text: 'Comprei um organizador de escritório. A precisão dos encaixes é incrível — dá pra ver que é feito numa impressora de qualidade. Super recomendo.',
  },
]

/** Convite sutil para rolar — some assim que o texto foco é revelado. */
function ScrollCue({ visible }: { visible: boolean }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="absolute inset-x-0 bottom-6 flex justify-center text-brand-300/80"
      aria-hidden
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </motion.div>
  )
}

/** Uma linha do título com máscara "clip-up": o texto extrude de baixo pra cima. */
function HeadlineLine({
  children,
  revealed,
  reduced,
  delay,
  className = '',
}: {
  children: React.ReactNode
  revealed: boolean
  reduced: boolean | null
  delay: number
  className?: string
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={reduced ? false : { y: '100%' }}
        animate={reduced || revealed ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 0.6, delay: reduced ? 0 : delay, ease: HEADLINE_EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Sweep sutil que "assina" a linha em destaque a cada ciclo concluído (key={pulseKey} força o replay). */
function AccentSweep({ reduced }: { reduced: boolean | null }) {
  if (reduced) return null
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.span
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ x: '-120%' }}
        animate={{ x: '220%' }}
        transition={{ duration: 0.9, ease: HEADLINE_EASE }}
      />
    </span>
  )
}

export function HomeClient() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [revealed, setRevealed] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)
  const reduced = useReducedMotion()

  // Texto foco sobe quando a peça está prestes a terminar de imprimir (overlap
  // deliberado, ver usePrintLoop.ts) — com um prazo de segurança caso o bundle
  // 3D falhe ou demore (ver Hero3DPrinter.tsx / Hero3DErrorBoundary).
  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), REVEAL_FALLBACK_MS)
    return () => clearTimeout(timeout)
  }, [])

  const handleBuildNearComplete = () => {
    setRevealed(true)
    setPulseKey((k) => k + 1)
  }

  useEffect(() => {
    import('@/lib/supabase/browser').then(async ({ createClient }) => {
      const supabase = createClient()
      type ClickRow = { product_id: string; click_count: number }
      const SELECT = '*, category:categories(*), images:product_images(*), colors:product_colors(color:colors(*))'

      const { data: clicks } = await supabase.rpc('get_most_clicked_products', { p_limit: 12 })
      let products: Product[] = []

      if (clicks && (clicks as ClickRow[]).length > 0) {
        const ids = (clicks as ClickRow[]).map((c) => c.product_id)
        const { data } = await supabase.from('products').select(SELECT).eq('is_available', true).in('id', ids)
        if (data) {
          const countMap = new Map((clicks as ClickRow[]).map((c) => [c.product_id, c.click_count]))
          products = data
            .map((p) => ({ ...p, colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [] }) as Product)
            .sort((a, b) => ((countMap.get(b.id) as number) ?? 0) - ((countMap.get(a.id) as number) ?? 0))
        }
      }

      if (products.length < 12) {
        const existingIds = new Set(products.map((p) => p.id))
        const { data: fillData } = await supabase
          .from('products')
          .select(SELECT)
          .eq('is_available', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(12)
        if (fillData) {
          const extras = fillData
            .filter((p) => !existingIds.has(p.id))
            .slice(0, 12 - products.length)
            .map((p) => ({ ...p, colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [] }) as Product)
          products = [...products, ...extras]
        }
      }

      setFeatured(products)
    })
  }, [])

  return (
    <div>
      {/* Hero — a peça se "criando" em time-lapse domina a primeira tela, título sobreposto */}
      <section className="relative overflow-hidden bg-zinc-950 h-[78svh]">
        <Hero3DPrinter
          onFirstPrintComplete={() => setRevealed(true)}
          onBuildNearComplete={handleBuildNearComplete}
        />

        {/* Proteção de contraste atrás do título sobreposto */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent pointer-events-none" />

        <div className="absolute inset-x-0 bottom-10 sm:bottom-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
              <HeadlineLine revealed={revealed} reduced={reduced} delay={0}>
                Impressão 3D que
              </HeadlineLine>
              <span className="relative inline-block">
                <HeadlineLine revealed={revealed} reduced={reduced} delay={0.1} className="text-brand-300">
                  transforma ideias
                </HeadlineLine>
                <AccentSweep key={pulseKey} reduced={reduced} />
              </span>
              <HeadlineLine revealed={revealed} reduced={reduced} delay={0.2}>
                em realidade
              </HeadlineLine>
            </h1>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={reduced || revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : 0.45, ease: HEADLINE_EASE }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <PrintCtaLink href="/catalog">
                Ver catálogo <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </PrintCtaLink>
              <PrintCtaLink href="/custom-order" variant="secondary">
                <Sparkles className="w-4 h-4 shrink-0 text-brand-300" aria-hidden />
                Projeto personalizado
              </PrintCtaLink>
            </motion.div>
          </div>
        </div>

        <ScrollCue visible={!revealed} />
      </section>

      {/* Features */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Package, title: 'Alta qualidade', desc: 'Impressora Bambu Lab com precisão de 0,05 mm' },
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

      {/* Os queridinhos */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Os mais populares</h2>
              <Link href="/catalog" className="text-brand-300 hover:text-brand-200 text-sm font-medium flex items-center gap-1 shrink-0 ml-4">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={featured} />
          </div>
        </section>
      )}

      {/* Avaliações */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white mb-2">O que nossos clientes dizem</h2>
              <p className="text-zinc-400 text-sm">Avaliações reais de quem já recebeu seus pedidos</p>
            </div>
          </LayerReveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(({ name, location, rating, text }) => (
              <div key={name} className="flex flex-col gap-4 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-300 fill-brand-300" aria-hidden />
                  ))}
                </div>
                {/* Text */}
                <p className="text-zinc-300 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-brand-700/30 border border-brand-700/50 flex items-center justify-center shrink-0">
                    <span className="text-brand-300 text-xs font-bold">{name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{name}</p>
                    <p className="text-zinc-500 text-xs">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-zinc-950">
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
