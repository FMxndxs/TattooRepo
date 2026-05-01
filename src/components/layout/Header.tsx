'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { CartIcon } from './CartIcon'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Imagination 3D"
              width={36}
              height={36}
              className="transition-opacity group-hover:opacity-80"
              priority
            />
            <span className="font-bold text-white text-lg tracking-tight">
              Imagination <span className="text-brand-300">3D</span>
            </span>
          </Link>

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
            <Link
              href="/custom-order"
              className="hidden md:flex items-center gap-1.5 bg-brand-700 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-lg shadow-brand-glow"
            >
              <Sparkles className="w-4 h-4" />
              Pedir agora
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
