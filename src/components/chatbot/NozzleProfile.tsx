'use client'
//chatbot
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'
import { MessageCircle, Zap } from 'lucide-react'
import nozzleImg from '@/assets/avatar/Gemini_Generated_Image_8bjjwd8bjjwd8bjj.png'

const STATS = [
  { label: 'Conhecimento 3D',      value: 98 },
  { label: 'Velocidade de Resp.',  value: 95 },
  { label: 'Criatividade',         value: 99 },
  { label: 'Simpatia',             value: 100 },
]

const ABILITIES = [
  '⚡ Catálogo Instantâneo',
  '💰 Radar de Preços',
  '🕐 Suporte 24/7',
  '✨ Personalização Total',
]

const BADGES = [
  { label: 'CLASSE',   value: 'Assistente Nível MAX' },
  { label: 'FACÇÃO',   value: 'Imagination 3D' },
  { label: 'ELEMENTO', value: 'Filamento' },
]

/* ── Stat bar ── */
function StatBar({ label, value, index }: { label: string; value: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        <span className="text-[10px] font-mono font-bold text-brand-300">{value}</span>
      </div>

      <div className="h-[5px] bg-zinc-800/80 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{
            duration: reduced ? 0.1 : 1.2,
            delay: reduced ? 0 : 0.25 + index * 0.13,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            background: 'linear-gradient(90deg, #431370 0%, #6a2ba8 50%, #b683ff 100%)',
            boxShadow: '0 0 10px rgba(182,131,255,0.45)',
          }}
        />
      </div>
    </div>
  )
}

/* ── Main component ── */
interface NozzleProfileProps {
  onSwitchToChat: () => void
}

export function NozzleProfile({ onSwitchToChat }: NozzleProfileProps) {
  const reduced = useReducedMotion()

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-smooth">

      {/* ── Hero image ── */}
      <div className="relative overflow-hidden bg-zinc-950 shrink-0" style={{ height: 230 }}>
        {/* Grid lines */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg,   #b683ff 0, #b683ff 1px, transparent 1px, transparent 22px),
              repeating-linear-gradient(90deg,  #b683ff 0, #b683ff 1px, transparent 1px, transparent 22px)
            `,
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 70%, rgba(106,43,168,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Full robot — object-contain shows the whole image */}
        <Image
          src={nozzleImg}
          alt="Nozzle, assistente da Imagination 3D"
          fill
          sizes="400px"
          className="object-contain object-bottom"
          priority
        />

        {/* Scanline texture */}
        {!reduced && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.07) 3px,
                rgba(0,0,0,0.07) 4px
              )`,
            }}
          />
        )}

        {/* Corner brackets */}
        <span aria-hidden className="absolute top-3 left-3 w-5 h-5 border-t-[2px] border-l-[2px] border-brand-500/50" />
        <span aria-hidden className="absolute top-3 right-3 w-5 h-5 border-t-[2px] border-r-[2px] border-brand-500/50" />
        <span aria-hidden className="absolute bottom-3 left-3 w-5 h-5 border-b-[2px] border-l-[2px] border-brand-500/30" />
        <span aria-hidden className="absolute bottom-3 right-3 w-5 h-5 border-b-[2px] border-r-[2px] border-brand-500/30" />

        {/* FICHA label */}
        <p
          aria-hidden
          className="absolute top-3 left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-[0.35em] text-brand-500/70 uppercase select-none"
        >
          FICHA DO PERSONAGEM
        </p>

        {/* Bottom fade into content */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-4 pb-7 space-y-5">

        {/* Name */}
        <div className="text-center -mt-1">
          <h2
            className="text-[2.1rem] font-black tracking-[0.18em] uppercase leading-none"
            style={{
              background: 'linear-gradient(140deg, #ffffff 25%, #b683ff 65%, #6a2ba8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 14px rgba(182,131,255,0.35))',
            }}
          >
            NOZZLE
          </h2>
          <p className="text-[9px] font-mono tracking-[0.22em] text-zinc-600 uppercase mt-1">
            Assistente de Impressão 3D
          </p>
        </div>

        {/* Class badges */}
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 px-2 py-2 text-center"
            >
              <p className="text-[7px] font-mono tracking-[0.2em] text-zinc-600 uppercase">{label}</p>
              <p className="text-[10px] font-semibold text-brand-300 mt-0.5 leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Origin story */}
        <div
          className="rounded-xl border border-brand-700/35 p-3.5 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(67,19,112,0.22) 0%, rgba(20,8,40,0.5) 100%)',
          }}
        >
          <span aria-hidden className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-brand-500/30" />
          <span aria-hidden className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-brand-500/30" />

          <p className="text-[11px] text-zinc-300 leading-[1.7] font-mono">
            <span className="text-brand-400 font-bold select-none">› </span>
            Nascido da primeira impressão da Imagination 3D…
            <br />
            <span className="text-brand-400 font-bold select-none">› </span>
            Moldado camada por camada em PLA Roxo Galáxia…
            <br />
            <span className="text-brand-400 font-bold select-none">› </span>
            Programado com um único objetivo:{' '}
            <span className="text-white font-semibold">
              te ajudar a criar o impossível.
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <p className="text-[8px] font-mono tracking-[0.28em] text-zinc-700 uppercase">
            // atributos
          </p>
          {STATS.map((s, i) => (
            <StatBar key={s.label} label={s.label} value={s.value} index={i} />
          ))}
        </div>

        {/* Abilities */}
        <div>
          <p className="text-[8px] font-mono tracking-[0.28em] text-zinc-700 uppercase mb-2.5">
            // habilidades especiais
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ABILITIES.map((a) => (
              <span
                key={a}
                className="text-[10px] font-semibold text-brand-300 bg-brand-700/20 border border-brand-700/50 rounded-full px-2.5 py-1 leading-none"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Quote */}
        <blockquote className="border-l-2 border-brand-500/60 pl-3.5">
          <p className="text-[11px] text-zinc-500 italic leading-relaxed">
            "Cada camada que imprimo é uma história que começo a contar. 🖨️"
          </p>
        </blockquote>

        {/* CTA */}
        <motion.button
          type="button"
          onClick={onSwitchToChat}
          whileHover={reduced ? undefined : { scale: 1.02, y: -1 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white relative overflow-hidden print-cta-sheen"
          style={{
            background: 'linear-gradient(135deg, #431370 0%, #6a2ba8 100%)',
            boxShadow: '0 4px 24px rgba(67,19,112,0.65)',
          }}
        >
          <span className="print-cta-filament" aria-hidden />
          <MessageCircle className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Falar com o Nozzle</span>
          <Zap className="w-3.5 h-3.5 relative z-10 text-brand-300" />
        </motion.button>
      </div>
    </div>
  )
}
