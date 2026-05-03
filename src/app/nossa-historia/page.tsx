import type { Metadata } from 'next'
import { LayerReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { PrintCtaLink } from '@/components/ui/PrintCtaLink'
import { Sparkles, Heart, Zap, Users, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Nossa História | Imagination 3D',
  description: 'Conheça a história, os princípios e a visão por trás da Imagination 3D — impressão 3D de alta qualidade com Bambu Lab A1.',
}

const values = [
  {
    icon: Heart,
    title: 'Paixão pelo que fazemos',
    desc: 'Cada peça impressa carrega dedicação. Não fazemos produção em massa — cada projeto é tratado como único.',
  },
  {
    icon: Zap,
    title: 'Tecnologia de ponta',
    desc: 'A Bambu Lab A1 é uma das impressoras mais precisas do mercado. Escolhemos o melhor equipamento para entregarmos o melhor resultado.',
  },
  {
    icon: Users,
    title: 'Próximos do cliente',
    desc: 'Orçamento, dúvidas, acompanhamento — tudo pelo WhatsApp, sem burocracia. Você fala diretamente com quem faz.',
  },
  {
    icon: Target,
    title: 'Qualidade sem concessões',
    desc: 'Filamentos selecionados, calibração constante e inspeção manual em cada peça. Não enviamos o que não nos orgulhamos.',
  },
]

const milestones = [
  {
    year: '2023',
    title: 'O primeiro projeto',
    desc: 'Tudo começou com uma impressora, um quarto e a vontade de transformar arquivos digitais em objetos reais. O primeiro pedido foi de um amigo — um suporte de mesa personalizado. A entrega foi perfeita, o entusiasmo, maior ainda.',
  },
  {
    year: '2024',
    title: 'Bambu Lab A1',
    desc: 'Com o crescimento dos pedidos, chegou o momento de investir no melhor: a Bambu Lab A1. Precisão de 0,05 mm, velocidade e confiabilidade levaram a qualidade das peças a outro nível.',
  },
  {
    year: '2025',
    title: 'Imagination 3D nasce oficialmente',
    desc: 'O que era um hobby virou um catálogo com mais de 20 produtos, dezenas de cores disponíveis e a possibilidade de qualquer pessoa trazer sua própria ideia para a realidade.',
  },
]

export default function NossaHistoriaPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/25 via-brand-900/10 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LayerReveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-brand-700/15 border border-brand-500/35 text-brand-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Feito com propósito
            </div>
          </LayerReveal>

          <LayerReveal delay={0.08}>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Da ideia à realidade —<br />
              <span className="text-brand-300">nossa trajetória</span>
            </h1>
          </LayerReveal>

          <LayerReveal delay={0.16}>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              A Imagination 3D nasceu da crença de que impressão 3D de qualidade deveria ser acessível a qualquer pessoa. Aqui está como chegamos até aqui.
            </p>
          </LayerReveal>
        </div>
      </section>

      {/* Logo destaque */}
      <section className="py-12 bg-zinc-900/40">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <LayerReveal>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-brand-700/20 border border-brand-700/40 flex items-center justify-center shadow-[0_0_40px_-8px_rgba(67,19,112,0.5)]">
                <Image src="/logo.png" alt="Imagination 3D" width={52} height={52} />
              </div>
              <p className="text-zinc-500 text-sm">Imagination 3D — São Paulo, Brasil</p>
            </div>
          </LayerReveal>
        </div>
      </section>

      {/* Linha do tempo */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <h2 className="text-2xl font-bold text-white mb-12 text-center">Como chegamos até aqui</h2>
          </LayerReveal>

          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-700/60 via-brand-500/30 to-transparent hidden sm:block" />

            <div className="space-y-10">
              {milestones.map(({ year, title, desc }, i) => (
                <LayerReveal key={year} delay={i * 0.1}>
                  <div className="flex gap-6">
                    {/* Dot */}
                    <div className="hidden sm:flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-full bg-brand-700/20 border border-brand-700/50 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(67,19,112,0.6)]">
                        <span className="text-brand-300 text-xs font-bold">{year}</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="sm:hidden text-brand-300 text-xs font-bold mb-1">{year}</div>
                      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                      <p className="text-zinc-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </LayerReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nossos valores */}
      <section className="py-20 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white mb-3">O que nos move</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">Esses são os princípios que guiam cada decisão — do filamento que escolhemos ao atendimento que oferecemos.</p>
            </div>
          </LayerReveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="w-10 h-10 bg-brand-700/15 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Visão */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <div className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 text-center shadow-[0_20px_60px_-20px_rgba(67,19,112,0.3)]">
              <div className="w-10 h-10 bg-brand-700/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-5 h-5 text-brand-300" />
              </div>
              <h2 className="text-xl font-bold text-white mb-4">Nossa visão</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Ser a referência em impressão 3D personalizada no Brasil — não pelo volume, mas pela qualidade e pela proximidade com cada cliente. Acreditamos que toda ideia merece existir no mundo físico.
              </p>
            </div>
          </LayerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <LayerReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para criar algo único?</h2>
            <p className="text-zinc-400 mb-8">Explore o catálogo ou traga sua própria ideia — estamos prontos para imprimir.</p>
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
    </div>
  )
}
