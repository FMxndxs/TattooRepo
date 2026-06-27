'use client'

/**
 * ToastContainer — renderiza as notificações do ToastContext.
 * Posicionado fixed bottom-right; animações via motion/react.
 * Adicionar <ToastContainer /> dentro de <ToastProvider> no layout raiz.
 */

import { AnimatePresence, motion } from 'motion/react'
import { X, CheckCircle2, XCircle, Info } from 'lucide-react'
import { useToast } from '@/lib/context/ToastContext'
import type { ToastType } from '@/lib/context/ToastContext'

// ─── Mapeamento de tipo → estilo + ícone ──────────────────────────────────────

const ICON_MAP: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const COLOR_MAP: Record<ToastType, string> = {
  success: 'border-green-700/60 [&>svg:first-child]:text-green-400',
  error:   'border-red-700/60   [&>svg:first-child]:text-red-400',
  info:    'border-brand-700/60 [&>svg:first-child]:text-brand-300',
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-4 z-[60] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICON_MAP[type]
          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -8,  scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 min-w-[260px] max-w-[calc(100vw-2rem)] sm:max-w-sm bg-zinc-900 border rounded-2xl px-4 py-3 shadow-2xl ${COLOR_MAP[type]}`}
              role="status"
            >
              <Icon className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-sm flex-1 text-white">{message}</p>
              <button
                onClick={() => dismissToast(id)}
                className="shrink-0 text-zinc-500 hover:text-white transition-colors rounded-md"
                aria-label="Fechar notificação"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
