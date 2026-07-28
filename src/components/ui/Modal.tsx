'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: ModalSize
}

const sizeClass: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const reduced = useReducedMotion()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Focus first focusable element
  useEffect(() => {
    if (!isOpen || !contentRef.current) return
    const focusable = contentRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    focusable?.focus()
  }, [isOpen])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose],
  )

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.08 : 0.2 }}
        >
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            className={`relative w-full ${sizeClass[size]} bg-surface border border-border-strong/80 rounded-2xl shadow-2xl overflow-hidden`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scaleY: 0.96 }}
            transition={{ duration: reduced ? 0.08 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 3D print decoration — top scan line */}
            <div
              aria-hidden
              className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/70 to-transparent"
            />

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
                <h2
                  id="modal-title"
                  className="text-foreground font-bold text-lg tracking-tight"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Fechar"
                  className="text-foreground-muted hover:text-foreground transition-colors p-1 rounded-lg hover:bg-surface-elevated"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {!title && (
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors p-1 rounded-lg hover:bg-surface-elevated z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
