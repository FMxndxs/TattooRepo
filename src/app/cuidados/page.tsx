import type { Metadata } from 'next'
import { LayerReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { CtaLink } from '@/components/ui/CtaLink'
import { Sparkles, AlertCircle, Clock, Droplet, Sun, Activity, Shield, CheckCircle, ArrowRight } from 'lucide-react'
import Script from 'next/script'
import { faqPageSchema, type FAQItem } from '@/lib/seo/schema'

export const metadata: Metadata = {
  title: 'Guia de Cuidados Pós-Tatuagem',
  description: 'Saiba como cuidar da sua tatuagem nos primeiros dias. Limpeza, hidratação e o que evitar para uma cicatrização perfeita.',
  alternates: { canonical: '/cuidados' },
  openGraph: { type: 'website' },
}

const careSteps = [
  {
    icon: Clock,
    title: 'Primeiras 24-48 horas',
    desc: 'A tatuagem está fresca e vulnerável. Mantenha a área limpa e protegida com o curativo indicado pelo artista. Não remova o curativo antes do tempo recomendado.',
  },
  {
    icon: Droplet,
    title: 'Limpeza correta',
    desc: 'Lave com água morna e sabonete neutro 2-3 vezes ao dia. Use as mãos limpas ou papel toalha descartável. Nunca use panos reutilizáveis, que podem trazer bactérias.',
  },
  {
    icon: Shield,
    title: 'Hidratação e proteção',
    desc: 'Após a limpeza, aplique pomada ou loção específica para tatuagens (sem antibióticos). Mantenha a área levemente hidratada, mas não encharcada. Use protetor solar SPF 30+ após a cicatrização inicial.',
  },
  {
    icon: Sun,
    title: 'Evite sol e água',
    desc: 'Nos primeiros 15 dias, evite exposição solar direta — pode desbotar a tatuagem. Não mergulhe em piscinas, mar ou banheiras. Banhos rápidos com água morna são OK.',
  },
  {
    icon: Activity,
    title: 'Sem exercício intenso',
    desc: 'Evite atividades que causem muito suor nos primeiros 7-10 dias. Exercícios intensos abrem os poros e aumentam o risco de infecção. Caminhas leves estão OK.',
  },
  {
    icon: AlertCircle,
    title: 'Sinais de infecção',
    desc: 'Se notar vermelhidão excessiva, inchaço, pus, febre ou coceira intensinha que não passa, procure um médico. Essas são sinais de que algo pode estar errado.',
  },
]

const faqItems: FAQItem[] = [
  {
    question: 'Quanto tempo leva para uma tatuagem cicatrizar?',
    answer: 'A cicatrização varia de 2 a 4 semanas externamente, mas a pele leva até 3 meses para cicatrizar completamente por dentro. Siga os cuidados durante todo este período.',
  },
  {
    question: 'Posso tomar banho após fazer uma tatuagem?',
    answer: 'Sim! Banhos curtos e rápidos com água morna estão OK. Evite água muito quente nos primeiros 2-3 dias e não deixe a tatuagem submersa em piscinas ou mar durante a cicatrização.',
  },
  {
    question: 'A tatuagem vai descascar? É normal?',
    answer: 'Sim, é completamente normal. A descamação é parte do processo de cicatrização. Não puxe ou raspe — deixe cair naturalmente. Mantenha hidratada durante essa fase.',
  },
  {
    question: 'Quando posso retornar ao exercício intenso?',
    answer: 'Espere pelo menos 7-10 dias antes de atividades que causem muito suor. Exercícios que abrem os poros aumentam o risco de infecção durante a cicatrização.',
  },
  {
    question: 'Posso ir à praia ou piscina?',
    answer: 'Não nos primeiros 15-20 dias. A água clorada da piscina e a água salgada do mar podem irritar e infectar a tatuagem. Depois da cicatrização, sempre use protetor solar.',
  },
  {
    question: 'Quando devo usar protetor solar?',
    answer: 'Após a cicatrização externa (cerca de 2-3 semanas), comece a usar SPF 30+ sempre que expor a tatuagem ao sol. Isso mantém as cores vibrantes e a tinta protegida por muito tempo.',
  },
]

export default function CuidadosPage() {
  const schemaJson = faqPageSchema(faqItems)

  return (
    <div>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/25 via-brand-900/10 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LayerReveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-brand-700/15 border border-brand-500/35 text-brand-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Tatuagem cuidada, tatuagem bonita
            </div>
          </LayerReveal>

          <LayerReveal delay={0.08}>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Cuidados pós-tatuagem —<br />
              <span className="text-brand-300">guia completo</span>
            </h1>
          </LayerReveal>

          <LayerReveal delay={0.16}>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Os primeiros dias são os mais críticos. Aqui você encontra tudo o que precisa saber para que sua tatuagem cicatrize perfeita e as cores permaneçam vibrantes.
            </p>
          </LayerReveal>
        </div>
      </section>

      {/* Passo a passo */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white mb-3">Passo a passo dos cuidados</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">Seis pontos essenciais que você precisa seguir para uma cicatrização saudável.</p>
            </div>
          </LayerReveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careSteps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
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

      {/* Timeline de cicatrização */}
      <section className="py-20 bg-zinc-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <h2 className="text-2xl font-bold text-white mb-12 text-center">Timeline de cicatrização</h2>
          </LayerReveal>

          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-700/60 via-brand-500/30 to-transparent hidden sm:block" />

            <div className="space-y-8">
              {[
                {
                  period: '24-48h',
                  title: 'Primeira noite crítica',
                  details: 'Possível inchaço e vermelhidão. Mantenha o curativo. A tatuagem vai "sangrar" um pouco de plasma — é normal.',
                },
                {
                  period: '3-7 dias',
                  title: 'Coceira e descamação começam',
                  details: 'Área pode coçar bastante. NÃO coce — pode tirar tinta. Comece a hidratar com loção específica. Banhos rápidos estão OK.',
                },
                {
                  period: '1-2 semanas',
                  title: 'Descamação ativa',
                  details: 'Pele vai descascar naturalmente. Não puxe — deixe cair. Continue hidratando. Ainda evite sol e água prolongada.',
                },
                {
                  period: '2-4 semanas',
                  title: 'Aparência externa cicatrizada',
                  details: 'A tatuagem vai parecer cicatrizada externamente. Mas por dentro a pele ainda está se regenerando. Mantenha os cuidados.',
                },
                {
                  period: '1-3 meses',
                  title: 'Cicatrização completa',
                  details: 'Pele totalmente regenerada internamente. Cores finais aparecem agora — podem parecer diferentes das primeiras semanas (é normal).',
                },
              ].map(({ period, title, details }, i) => (
                <LayerReveal key={period} delay={i * 0.1}>
                  <div className="flex gap-6">
                    {/* Dot */}
                    <div className="hidden sm:flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-full bg-brand-700/20 border border-brand-700/50 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(67,19,112,0.6)]">
                        <span className="text-brand-300 text-xs font-bold text-center">{period}</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="sm:hidden text-brand-300 text-xs font-bold mb-1">{period}</div>
                      <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                      <p className="text-zinc-400 leading-relaxed text-sm">{details}</p>
                    </div>
                  </div>
                </LayerReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LayerReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white mb-3">Perguntas frequentes</h2>
              <p className="text-zinc-400">Respostas para as dúvidas mais comuns sobre cuidados pós-tatuagem.</p>
            </div>
          </LayerReveal>

          <StaggerGroup className="space-y-4">
            {faqItems.map(({ question, answer }, i) => (
              <details
                key={i}
                className="group p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <summary className="flex items-start gap-3 font-semibold text-white list-none">
                  <CheckCircle className="w-5 h-5 text-brand-300 shrink-0 mt-0.5 group-open:hidden" aria-hidden />
                  <span>{question}</span>
                </summary>
                <p className="text-zinc-400 text-sm leading-relaxed mt-4 ml-8">{answer}</p>
              </details>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Aviso importante */}
      <section className="py-16 bg-brand-700/10 border-y border-brand-700/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <LayerReveal>
            <div className="inline-flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-brand-300" aria-hidden />
              <span className="text-brand-300 font-semibold text-sm">Aviso importante</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Se você notar sinais de infecção — como febre, inchaço excessivo, pus ou vermelhidão que piora após alguns dias — procure um médico imediatamente. Não tente tratar infecções sozinho.
            </p>
          </LayerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <LayerReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para sua próxima tatuagem?</h2>
            <p className="text-zinc-400 mb-8">Com os cuidados corretos, sua tatuagem vai durar belíssima por muito tempo. Agende sua sessão agora.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CtaLink href="/agendar">
                Agendar sessão <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </CtaLink>
              <CtaLink href="/portfolio" variant="secondary">
                <Sparkles className="w-4 h-4 shrink-0 text-brand-300" aria-hidden />
                Ver portfólio
              </CtaLink>
            </div>
          </LayerReveal>
        </div>
      </section>
    </div>
  )
}
