'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { CartIcon } from './CartIcon'
import { UserMenu } from './UserMenu'
import { ChatIcon } from './ChatIcon'

export function Header() {
  const reduced = useReducedMotion()

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/90 print-header-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div whileHover={reduced ? undefined : { scale: 1.03 }} transition={{ type: 'spring', stiffness: 420, damping: 26 }}>
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Imagination 3D"
                width={44}
                height={44}
                className="[filter:drop-shadow(0_0_6px_rgba(182,131,255,0.18))] transition-[filter] duration-200 group-hover:[filter:drop-shadow(0_0_12px_rgba(182,131,255,0.45))]"
                priority
              />
              <span className="font-bold text-white text-xl tracking-tight">
                Imagination <span className="text-brand-300">3D</span>
              </span>
            </Link>
          </motion.div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7">
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
            <Link
              href="/nossa-historia"
              aria-label="nossa história"
              className="relative text-zinc-400 hover:text-white text-sm font-medium transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-500 after:to-brand-300 after:transition-all hover:after:w-full"
            >
              Nossa História
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <CartIcon />
            <ChatIcon />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
