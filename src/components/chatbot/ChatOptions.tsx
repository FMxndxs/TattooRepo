'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ChatOption } from '@/lib/chatbot/types'

interface ChatOptionsProps {
  options: ChatOption[]
  onSelect: (option: ChatOption) => void
}

export function ChatOptions({ options, onSelect }: ChatOptionsProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.05 : 0.2, delay: reduced ? 0 : 0.12 }}
      className="flex flex-wrap gap-2 pt-1"
    >
      {options.map((opt) => (
        <motion.button
          key={opt.nextNodeId}
          type="button"
          onClick={() => onSelect(opt)}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          className="text-left text-xs text-brand-300 border border-brand-700/50 hover:border-brand-500 hover:bg-brand-700/10 rounded-full px-3 py-1.5 transition-colors"
        >
          {opt.label}
        </motion.button>
      ))}
    </motion.div>
  )
}
