'use client'

import { motion, useReducedMotion } from 'motion/react'
import { NozzleAvatar } from './NozzleAvatar'

export function TypingIndicator() {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-2 justify-start"
      aria-live="polite"
      aria-label="Nozzle está digitando"
    >
      <div className="w-8 h-8 rounded-full ring-1 ring-brand-500/40 overflow-hidden shrink-0 mt-auto">
        <NozzleAvatar size={32} />
      </div>

      <div className="bg-surface-elevated rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {reduced ? (
          <span className="text-xs text-foreground-subtle italic">Nozzle está digitando…</span>
        ) : (
          ([0, 0.15, 0.3] as number[]).map((delay, i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-500 block"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}
