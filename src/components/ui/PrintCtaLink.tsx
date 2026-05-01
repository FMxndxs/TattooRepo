'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface PrintCtaLinkProps {
  href: string
  variant?: Variant
  children: React.ReactNode
  className?: string
}

const MotionLink = motion.create(Link)

const variantClass: Record<Variant, string> = {
  primary:
    'bg-brand-700 hover:bg-brand-500 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-brand-glow ring-1 ring-white/10',
  secondary:
    'bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-full ring-1 ring-zinc-700/80',
  ghost:
    'bg-transparent text-brand-300 hover:text-brand-200 font-bold px-8 py-4 rounded-full ring-2 ring-brand-500/35 hover:ring-brand-400/55',
}

/**
 * CTAs com shimmer de “extrusão” no hover, lift e tap — tema impressão 3D.
 */
export function PrintCtaLink({ href, variant = 'primary', children, className = '' }: PrintCtaLinkProps) {
  const reduced = useReducedMotion()

  return (
    <MotionLink
      href={href}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden transition-colors duration-200 ${variantClass[variant]} print-cta-sheen rounded-full ${className}`}
      whileHover={reduced ? undefined : { y: -3 }}
      whileTap={reduced ? undefined : { scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      <span className="print-cta-filament" aria-hidden />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </MotionLink>
  )
}
