'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Sparkles, ChevronDown, User, LogOut, Layers, LogIn, Package } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { PrintCtaLink } from '@/components/ui/PrintCtaLink'
import { useAuthModalStore } from '@/lib/store/authModalStore'

export function UserMenu() {
  const { isAuthenticated, profile, signOut, loading } = useAuth()
  const openModal = useAuthModalStore((s) => s.openModal)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    if (dropdownOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [dropdownOpen])

  if (loading) return null

  // Not authenticated — show CTA
  if (!isAuthenticated) {
    return (
      <>
        <motion.button
          type="button"
          onClick={() => openModal('login')}
          aria-label="Entrar na conta"
          whileHover={reduced ? undefined : { scale: 1.05 }}
          whileTap={reduced ? undefined : { scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 480, damping: 26 }}
          className="flex items-center gap-1.5 border border-zinc-700/60 hover:border-brand-500/60 text-zinc-400 hover:text-brand-300 hover:bg-brand-700/10 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
        >
          <LogIn className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Entrar</span>
        </motion.button>
        <PrintCtaLink
          href="/custom-order"
          className="hidden md:inline-flex !py-2 !px-4 !text-sm !font-semibold"
        >
          <Sparkles className="w-4 h-4 shrink-0" aria-hidden />
          Pedir agora
        </PrintCtaLink>
      </>
    )
  }

  const firstName = profile?.first_name ?? 'Você'

  return (
    <div ref={menuRef} className="relative hidden md:block">
      <motion.button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        aria-expanded={dropdownOpen}
        aria-label="Menu da conta"
        whileTap={reduced ? undefined : { scale: 0.97 }}
        className="flex items-center gap-2 bg-brand-700 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors ring-1 ring-white/10"
      >
        {/* Avatar */}
        <span className="w-6 h-6 rounded-full bg-brand-300/20 flex items-center justify-center">
          <Layers className="w-3.5 h-3.5 text-brand-300" />
        </span>
        Olá, {firstName}
        <motion.span
          animate={{ rotate: dropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: reduced ? 0.06 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
          >
            {/* Top accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

            {/* User info */}
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-white text-sm font-semibold truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <Link
                href="/perfil"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm transition-colors"
              >
                <User className="w-4 h-4 shrink-0" />
                Meu Perfil
              </Link>
              <Link
                href="/meus-pedidos"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm transition-colors"
              >
                <Package className="w-4 h-4 shrink-0" />
                Meus Pedidos
              </Link>
              <Link
                href="/custom-order"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm transition-colors"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                Pedido Personalizado
              </Link>
            </div>

            <div className="border-t border-zinc-800 py-1.5">
              <button
                type="button"
                onClick={async () => {
                  setDropdownOpen(false)
                  await signOut()
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
