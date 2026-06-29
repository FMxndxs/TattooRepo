'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Package, LayoutGrid, MessageSquare, LogOut, Home, Settings,
  Layers, BarChart2, SendHorizontal, Menu, X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useAuth } from '@/lib/context/AuthContext'

// ─── Navegação ────────────────────────────────────────────────────────────────

const navItems = [
  { href: '/admin',           label: 'Visão Geral',   icon: LayoutGrid,     exact: true },
  { href: '/admin/products',  label: 'Produtos',      icon: Package },
  { href: '/admin/orders',    label: 'Pedidos',       icon: MessageSquare },
  { href: '/admin/producao',  label: 'Produção',      icon: Layers },
  { href: '/admin/despacho',  label: 'Despacho',      icon: SendHorizontal },
  { href: '/admin/relatorios',label: 'Relatórios',    icon: BarChart2 },
  { href: '/admin/settings',  label: 'Configurações', icon: Settings },
]

// ─── Conteúdo reutilizado em desktop e mobile ─────────────────────────────────

function SidebarContent({
  onLinkClick,
  showClose,
  onClose,
}: {
  onLinkClick?: () => void
  showClose?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleLogout() {
    await signOut()
    // replace() instead of push() so the admin page is removed from history;
    // no router.refresh() needed — the auth state change from signOut already
    // triggers a re-render and the middleware blocks /admin for signed-out users.
    router.replace('/')
  }

  return (
    <>
      {/* Cabeçalho */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Admin</span>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            aria-label="Fechar menu de navegação"
            className="p-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-700/15 text-brand-300'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-zinc-800 space-y-1 shrink-0">
        <Link
          href="/"
          aria-label="Ver o site público"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Home className="w-4 h-4 shrink-0" />
          Ver site
        </Link>
        <button
          onClick={handleLogout}
          aria-label="Sair do painel admin"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </>
  )
}

// ─── AdminSidebar ─────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  // Fecha o drawer ao navegar
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const drawerTransition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, damping: 30, stiffness: 300 }

  const overlayTransition = reducedMotion ? { duration: 0 } : { duration: 0.15 }

  return (
    <>
      {/* ── Sidebar fixa no desktop (md+) ──────────────────────────── */}
      <aside className="hidden md:flex w-60 bg-zinc-900 border-r border-zinc-800 flex-col min-h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Botão hambúrguer no mobile (md-) ──────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu de navegação"
        className="fixed top-4 left-4 z-40 flex md:hidden items-center justify-center w-9 h-9 bg-zinc-900/90 border border-zinc-700 rounded-xl text-zinc-300 hover:text-white shadow-lg backdrop-blur-sm transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Drawer + backdrop mobile ──────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={overlayTransition}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Painel lateral */}
            <motion.aside
              key="drawer"
              className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col md:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={drawerTransition}
              aria-label="Menu de navegação admin"
            >
              <SidebarContent
                showClose
                onClose={() => setIsOpen(false)}
                onLinkClick={() => setIsOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
