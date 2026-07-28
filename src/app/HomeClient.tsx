'use client'

import { Sparkles, ArrowRight, ChevronDown, Palette, Package, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { LayerReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { PrintCtaLink } from '@/components/ui/PrintCtaLink'

// Reveal do título "extrude" de baixo pra cima, mesma direção/qualidade de
// movimento da peça sendo "criada" no hero 3D — ver usePrintLoop.ts.
const HEADLINE_EASE = [0.22, 1, 0.36, 1] as const

// Segurança: se o bundle 3D falhar/demorar, revela o título mesmo assim depois
// desse prazo (bem maior que o ciclo natural de ~9s) em vez de ficar escondido pra sempre.
const REVEAL_FALLBACK_MS = 12000

const reviews = [
  {
    name: 'Carolina Silva',
    location: 'São Paulo, SP',
    rating: 5,
    text: 'Fiz uma tatuagem de flash e ficou perfeita! Kadu é muito atencioso, ouuve minhas ideias e executou com precisão. Tenho planos de voltar para mais!',
  },
  {
    name: 'Felipe Santos',
    location: 'Campinas, SP',
    rating: 5,
    text: 'Pedi um orçamento para uma tatuagem personalizada e a resposta foi rápida. O design ficou exatamente como imaginei. Recomendo muito!',
  },
  {
    name: 'Beatriz Costa',
    location: 'Santo André, SP',
    rating: 5,
    text: 'Experiência incrível do começo ao fim. A esterilização é impecável e o ambiente muito limpo e acolhedor. Voltarei em breve!',
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
  const [revealed, setRevealed] = useState(false)
  const reduced = useReducedMotion()

  // Reveal do texto do hero após o hero ser renderizado
  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 300)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div>
      {/* Hero — estúdio de tatuagem Kadu Freitas */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-950 to-brand-950 h-[70svh] flex items-center justify-center">
        {/* Background decorativo com gradiente */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl" aria-hidden />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" aria-hidden />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={reduced || revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            Kadu Freitas Tattoo
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-zinc-300 mb-8 max-w-2xl mx-auto"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={reduced || revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tatuagens customizadas que contam sua história. Flashes exclusivas e designs personalizados.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={reduced || revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <PrintCtaLink href="/agendar">
              Agendar Agora <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
            </PrintCtaLink>
            <PrintCtaLink href="/portfolio" variant="secondary">
              <Sparkles className="w-4 h-4 shrink-0 text-brand-300" aria-hidden />
              Ver Portfólio
            </PrintCtaLink>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Package, title: 'Higiene Garantida', desc: 'Esterilização rigorosa e ambiente impecável' },
              { icon: Palette, title: 'Estilos Diversos', desc: 'Realismo, blackwork, lettering, fineline e muito mais' },
              { icon: Sparkles, title: 'Design Personalizado', desc: 'Crie sua ideia única com nosso orçamento customizado' },
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

      {/* Flashes Exclusivas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-zinc-900 rounded-2xl border border-zinc-800 p-8 md:p-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Flashes Exclusivas</h2>
              <p className="text-zinc-400 text-sm max-w-md">
                Desenhos prontos para tatuar — escolha o seu no portfólio e agende sua sessão.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <PrintCtaLink href="/portfolio">Ver Flashes</PrintCtaLink>
              <PrintCtaLink href="/agendar" variant="secondary">
                Agendar <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </PrintCtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white mb-2">O que nossos clientes dizem</h2>
              <p className="text-zinc-400 text-sm">Histórias reais de quem já foi tatuado por Kadu</p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para sua próxima tatuagem?</h2>
            <p className="text-zinc-400 mb-8">Agende seu horário ou solicite um orçamento para design personalizado.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrintCtaLink href="/agendar" className="!px-8 !py-4 text-lg">
                Agendar Horário
              </PrintCtaLink>
              <PrintCtaLink href="/custom-order" className="!px-8 !py-4 text-lg" variant="secondary">
                <Sparkles className="w-5 h-5 shrink-0" aria-hidden />
                Design Personalizado
              </PrintCtaLink>
            </div>
          </LayerReveal>
        </div>
      </section>
    </div>
  )
}
