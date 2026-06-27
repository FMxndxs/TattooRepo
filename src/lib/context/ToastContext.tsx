'use client'

/**
 * Sistema de toast leve — sem dep externa.
 * Máximo 3 toasts visíveis; auto-dismiss em 4 segundos.
 */

import { createContext, useContext, useState, useCallback, useRef } from 'react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const counterRef = useRef(0)

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `toast-${++counterRef.current}`
      // Mantém no máximo 3 toasts (remove o mais antigo)
      setToasts((prev) => [...prev.slice(-2), { id, message, type }])
      const timer = window.setTimeout(() => dismissToast(id), 4000)
      return () => clearTimeout(timer)
    },
    [dismissToast],
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}
