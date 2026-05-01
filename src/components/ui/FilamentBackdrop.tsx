'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Grade de “camadas” + varredura suave no hero — puramente decorativo (pointer-events: none).
 */
export function FilamentBackdrop() {
  const reduced = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="filament-grid absolute inset-0 opacity-[0.14]" />
      {reduced ? (
        <div className="absolute inset-0 filament-sweep-gradient opacity-35" />
      ) : (
        <motion.div
          className="absolute inset-0 filament-sweep-gradient"
          initial={false}
          animate={{ opacity: [0.25, 0.45, 0.28] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950 to-transparent mix-blend-normal" />
    </div>
  )
}
