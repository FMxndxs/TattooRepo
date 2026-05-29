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
                  <span
                    aria-hidden
                    className="absolute -bottom-[7px] right-8 w-3 h-3 bg-zinc-900 border-r border-b border-brand-700/70 rotate-45"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* FAB */}
            <div className="relative">
              {/* Outer pulse rings */}
              {showPulse && !reduced && (
                <>
                  <span
                    aria-hidden
                    className="absolute -inset-2 rounded-full border border-brand-300/25"
                    style={{ animation: 'nozzle-pulse 2s ease-in-out infinite 0.4s' }}
                  />
                  <span
                    aria-hidden
                    className="absolute -inset-0.5 rounded-full border-2 border-brand-300/45"
                    style={{ animation: 'nozzle-pulse 2s ease-in-out infinite' }}
                  />
                </>
              )}

              {/* Glow halo behind button */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: '0 0 32px 8px rgba(182,131,255,0.22), 0 4px 28px rgba(67,19,112,0.8)',
                }}
              />

              <motion.button
                type="button"
                onClick={handleOpen}
                whileHover={reduced ? undefined : { scale: 1.1 }}
                whileTap={reduced ? undefined : { scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 480, damping: 26 }}
                aria-label="Abrir Nozzle, assistente Imagination 3D"
                aria-expanded={isDrawerOpen}
                className="relative w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden ring-2 ring-brand-500/60 hover:ring-brand-300/70 transition-[box-shadow,ring] cursor-pointer"
              >
                {/* Mascote preenchendo o botão inteiro */}
                <NozzleAvatar fill objectPosition="50% 32%" />

                {/* Scanline sutil no hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(182,131,255,0.06) 100%)',
                  }}
                />
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
