import type { Metadata } from 'next'
import { LayerReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { CtaLink } from '@/components/ui/CtaLink'
import { Sparkles, Heart, Zap, Users, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Nossa História',
  description: 'Conheça a história, os princípios e a visão por trás do Kadu Freitas Tattoo — tatuagem de qualidade, higiene e autenticidade.',
  alternates: { canonical: '/nossa-historia' },
  openGraph: { type: 'website' },
}

const values = [
  {
    icon: Heart,
    title: 'Paixão pela arte',
    desc: 'Cada tatuagem é uma obra. Não fazemos produção em série — cada cliente traz uma história, e nós a transformamos em arte permanente.',
  },
  {
    icon: Zap,
    title: 'Higiene e esterilização',
    desc: 'Equipamentos esterilizados, materiais descartáveis e protocolos rigorosos. A saúde e segurança do nosso cliente vêm em primeiro lugar.',
  },
  {
    icon: Users,
    title: 'Atendimento personalizado',
    desc: 'Orçamento, dúvidas, acompanhamento — tudo pelo WhatsApp, sem burocracia. Você conversa direto com quem vai fazer sua tatuagem.',
  },
  {
    icon: Target,
    title: 'Autenticidade do traço',
    desc: 'Linhas precisas, cores vibrantes e design respeitoso. Cada detalhe é executado com maestria. Não tatuamos o que não nos orgulhamos.',
  },
]

const milestones = [
  {
    year: 'Início',
    title: 'A paixão que virou profissão',
    desc: 'Tudo começou com a paixão do Kadu pela tatuagem. Um estúdio simples, uma agulha, tinta de qualidade e a vontade de criar arte que durasse para a vida toda. Os primeiros clientes eram amigos, mas a qualidade e o atendimento personalizado logo conquistaram muito mais.',
  },
  {
    year: 'Consolidação',
    title: 'Elevando o padrão',
    desc: 'Com a crescente demanda, investimos em equipamentos de última geração, protocolos de higiene ainda mais rigorosos e um ambiente acolhedor para cada cliente. A reputação se consolidou: Kadu Freitas Tattoo tornou-se sinônimo de qualidade e confiança.',
  },
  {
    year: 'Hoje',
    title: 'Referência em tatuagem',
    desc: 'Agora somos um estúdio maduro, com uma cartela de designs próprios e a abertura total para projetos personalizados. A comunidade cresceu, mas mantemos o que nos define: respeito pela arte, cuidado com cada cliente e o compromisso com a excelência.',
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
              Da paixão à tinta —<br />
              <span className="text-brand-300">nossa trajetória</span>
            </h1>
          </LayerReveal>

          <LayerReveal delay={0.16}>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Kadu Freitas Tattoo nasceu da crença de que tatuagem de qualidade, feita com higiene e respeito, deveria ser acessível a qualquer pessoa. Aqui está como chegamos até aqui.
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
                <Image src="/logo.png" alt="Kadu Freitas Tattoo" width={52} height={52} />
              </div>
              <p className="text-zinc-500 text-sm">Kadu Freitas Tattoo — São Paulo, Brasil</p>
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
              <p className="text-zinc-400 max-w-xl mx-auto">Esses são os princípios que guiam cada decisão — da tinta que escolhemos ao respeito que oferecemos a cada cliente.</p>
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
                Ser a referência em tatuagem de qualidade no Brasil — não pelo volume, mas pela excelência no traço, higiene rigorosa e proximidade genuína com cada cliente. Acreditamos que toda história de vida merece ser marcada com arte.
              </p>
            </div>
          </LayerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <LayerReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para eternizar sua história?</h2>
            <p className="text-zinc-400 mb-8">Explore nossos trabalhos anteriores ou traga sua própria ideia — estamos prontos para criar sua tatuagem.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CtaLink href="/portfolio">
                Ver portfólio <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </CtaLink>
              <CtaLink href="/custom-order" variant="secondary">
                <Sparkles className="w-4 h-4 shrink-0 text-brand-300" aria-hidden />
                Projeto personalizado
              </CtaLink>
            </div>
          </LayerReveal>
        </div>
      </section>
    </div>
  )
}
