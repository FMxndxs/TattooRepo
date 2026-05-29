'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useChatStore } from '@/lib/store/chatStore'
import { Drawer } from '@/components/ui/Drawer'
import { ChatPanel } from '@/components/chatbot/ChatPanel'
import { NozzleAvatar } from '@/components/chatbot/NozzleAvatar'

export function NozzleFab() {
  const { isDrawerOpen, openChat, closeChat } = useChatStore()
  const reduced = useReducedMotion()
  const [showPulse, setShowPulse] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('nozzle_fab_greeted')) return

    setShowPulse(true)
    const t1 = setTimeout(() => setShowTooltip(true), 2000)
    const t2 = setTimeout(() => setShowTooltip(false), 7000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  function handleOpen() {
    if (showPulse) {
      setShowPulse(false)
      setShowTooltip(false)
      localStorage.setItem('nozzle_fab_greeted', '1')
    }
    openChat()
  }

  return (
    <>
      <AnimatePresence>
        {!isDrawerOpen && (
          <motion.div
            key="nozzle-fab"
            initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28, delay: 0.5 }}
            className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-2.5"
          >
            {/* First-visit tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="relative bg-zinc-900 border border-brand-700/70 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/40 max-w-[190px] text-right pointer-events-none"
                >
                  <p className="text-xs text-white font-semibold leading-snug">Oi! Eu sou o Nozzle 👋</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                    Posso te ajudar a encontrar o produto perfeito!
                  </p>
                  {/* Arrow pointing down-right */}
                  <span
                    aria-hidden
                    className="absolute -bottom-[7px] right-8 w-3 h-3 bg-zinc-900 border-r border-b border-brand-700/70 rotate-45"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* FAB */}
            <div className="relative">
              {/* Outer pulse ring */}
              {showPulse && !reduced && (
                <>
                  <span
                    aria-hidden
                    className="absolute -inset-1.5 rounded-full border border-brand-500/30"
                    style={{ animation: 'nozzle-pulse 2s ease-in-out infinite 0.25s' }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2 border-brand-300/40"
                    style={{ animation: 'nozzle-pulse 2s ease-in-out infinite' }}
                  />
                </>
              )}

              <motion.button
                type="button"
                onClick={handleOpen}
                whileHover={reduced ? undefined : { scale: 1.09 }}
                whileTap={reduced ? undefined : { scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 480, damping: 26 }}
                aria-label="Abrir Nozzle, assistente Imagination 3D"
                aria-expanded={isDrawerOpen}
                className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-700 hover:bg-brand-500 transition-colors shadow-[0_4px_28px_rgba(67,19,112,0.75)] ring-1 ring-brand-500/50 print-cta-sheen overflow-hidden"
              >
                <span className="print-cta-filament" aria-hidden />
                <span className="relative z-10">
                  <NozzleAvatar size={28} />
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer isOpen={isDrawerOpen} onClose={closeChat} width="w-full sm:w-[400px]">
        <ChatPanel />
      </Drawer>
    </>
  )
}
