'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { PrintCtaLink } from '@/components/ui/PrintCtaLink'
import { CartIcon } from './CartIcon'

export function Header() {
  const reduced = useReducedMotion()

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/90 print-header-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={reduced ? undefined : { scale: 1.03 }} transition={{ type: 'spring', stiffness: 420, damping: 26 }}>
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo.png"
                alt="Imagination 3D"
                width={36}
                height={36}
                className="transition-[opacity,filter] duration-200 group-hover:opacity-90 group-hover:[filter:drop-shadow(0_0_10px_rgba(182,131,255,0.35))]"
                priority
              />
              <span className="font-bold text-white text-lg tracking-tight">
                Imagination <span className="text-brand-300">3D</span>
              </span>
            </Link>
          </motion.div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/catalog"
              aria-label="catálogo"
              className="relative text-zinc-400 hover:text-white text-sm font-medium transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-500 after:to-brand-300 after:transition-all hover:after:w-full"
            >
              Catálogo
            </Link>
            <Link
              href="/custom-order"
              aria-label="pedido personalizado"
              className="relative text-zinc-400 hover:text-white text-sm font-medium transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-500 after:to-brand-300 after:transition-all hover:after:w-full"
            >
              Personalizado
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <CartIcon />
            <PrintCtaLink href="/custom-order" className="hidden md:inline-flex !py-2 !px-4 !text-sm !font-semibold">
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden />
              Pedir agora
            </PrintCtaLink>
          </div>
        </div>
      </div>
    </header>
  )
}
