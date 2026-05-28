'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  side?: 'left' | 'right'
  width?: string
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  width = 'w-full sm:w-[400px]',
}: DrawerProps) {
  const reduced = useReducedMotion()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return
    const focusable = drawerRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    focusable?.focus()
  }, [isOpen])

  const slideFrom = side === 'right' ? { x: '100%' } : { x: '-100%' }
  const position = side === 'right' ? 'right-0' : 'left-0'

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.08 : 0.2 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`absolute top-0 bottom-0 ${position} ${width} bg-background border-l border-border flex flex-col shadow-2xl`}
            initial={reduced ? { opacity: 0 } : slideFrom}
            animate={{ x: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : slideFrom}
            transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.9 }}
          >
            {/* Top accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-500/60 to-transparent shrink-0" />

            {/* Title bar */}
            {title && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <span className="text-foreground font-semibold text-sm">{title}</span>
                <button
                  onClick={onClose}
                  aria-label="Fechar"
                  className="text-foreground-muted hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-surface-elevated"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {!title && (
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-3.5 right-3.5 text-foreground-muted hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-surface-elevated z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Content fills remaining space */}
            <div className="flex-1 overflow-hidden">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
