'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  Menu, X, Sparkles, LayoutDashboard, User, Package, LogIn, LogOut, Layers,
} from 'lucide-react'
import { CartIcon } from './CartIcon'
import { UserMenu } from './UserMenu'
import { useAuth } from '@/lib/context/AuthContext'
import { useAuthModalStore } from '@/lib/store/authModalStore'

const navLinks = [
  { href: '/catalog', label: 'Catálogo' },
  { href: '/custom-order', label: 'Personalizado' },
  { href: '/nossa-historia', label: 'Nossa História' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, isAdmin, profile, signOut } = useAuth()
  const openModal = useAuthModalStore((s) => s.openModal)
  const reduced = useReducedMotion()

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/90 print-header-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            >
              <Link href="/" className="flex items-center gap-2.5 group">
                <Image
                  src="/logo.png"
                  alt="Imagination 3D"
                  width={38}
                  height={38}
                  className="[filter:drop-shadow(0_0_6px_rgba(182,131,255,0.18))] transition-[filter] duration-200 group-hover:[filter:drop-shadow(0_0_12px_rgba(182,131,255,0.45))]"
                  priority
                />
                <span className="font-bold text-white text-lg sm:text-xl tracking-tight">
                  Imagination <span className="text-brand-300">3D</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative text-zinc-400 hover:text-white text-sm font-medium transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-500 after:to-brand-300 after:transition-all hover:after:w-full"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <CartIcon />
              {/* Desktop user menu */}
              <UserMenu />
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              aria-hidden
            />

            {/* Drawer panel */}
            <motion.div
              role="dialog"
              aria-label="Menu de navegação"
              className="fixed top-0 right-0 h-full w-72 bg-zinc-950 border-l border-zinc-800 z-50 md:hidden flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80">
                <span className="text-white font-bold text-base tracking-tight">Menu</span>
                <button
                  type="button"
                  onClick={closeMobile}
                  aria-label="Fechar menu"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="px-3 py-4 space-y-0.5">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/70 text-sm font-medium transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="mx-5 border-t border-zinc-800/80" />

              {/* User section */}
              <div className="px-3 py-4 space-y-0.5 flex-1">
                {isAuthenticated ? (
                  <>
                    {/* Profile info */}
                    <div className="flex items-center gap-3 px-3 py-3 mb-1">
                      <div className="w-9 h-9 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4 text-brand-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-zinc-500 text-xs">Minha conta</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={closeMobile}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-brand-300 hover:text-white hover:bg-zinc-800/70 text-sm font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        Painel Admin
                      </Link>
                    )}
                    <Link
                      href="/perfil"
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/70 text-sm transition-colors"
                    >
                      <User className="w-4 h-4 shrink-0" />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/meus-pedidos"
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/70 text-sm transition-colors"
                    >
                      <Package className="w-4 h-4 shrink-0" />
                      Meus Pedidos
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        closeMobile()
                        await signOut()
                      }}
                      className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800/70 text-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      closeMobile()
                      openModal('login')
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/70 text-sm font-medium transition-colors"
                  >
                    <LogIn className="w-4 h-4 shrink-0" />
                    Entrar na conta
                  </button>
                )}
              </div>

              {/* CTA bottom */}
              <div className="p-4 border-t border-zinc-800/80">
                <Link
                  href="/custom-order"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full bg-brand-700 hover:bg-brand-500 text-white font-bold py-3 rounded-full transition-colors shadow-lg shadow-brand-glow text-sm"
                >
                  <Sparkles className="w-4 h-4 shrink-0" aria-hidden />
                  Pedir agora
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
