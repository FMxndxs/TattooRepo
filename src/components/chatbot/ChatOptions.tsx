'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ChatOption } from '@/lib/chatbot/types'

interface ChatOptionsProps {
  options: ChatOption[]
  onSelect: (option: ChatOption) => void
  disabled?: boolean
}

export function ChatOptions({ options, onSelect, disabled }: ChatOptionsProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.05 : 0.2, delay: reduced ? 0 : 0.08 }}
      className="flex flex-wrap gap-2 pt-1"
    >
      {options.map((opt, i) => (
        <motion.button
          key={opt.nextNodeId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onSelect(opt)}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.18,
            delay: reduced ? 0 : 0.12 + i * 0.055,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          className="text-left text-xs text-brand-300 border border-brand-700/50 hover:border-brand-500 hover:bg-brand-700/10 rounded-full px-3 py-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {opt.label}
        </motion.button>
      ))}
    </motion.div>
  )
}
