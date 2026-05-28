'use client'

import { motion, useReducedMotion } from 'motion/react'
import { NozzleAvatar } from './NozzleAvatar'
import type { ChatMessage } from '@/lib/chatbot/types'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const reduced = useReducedMotion()
  const isNozzle = message.from === 'nozzle'

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.05 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2 ${isNozzle ? 'justify-start' : 'justify-end'}`}
    >
      {isNozzle && (
        <div className="w-8 h-8 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 flex items-center justify-center shrink-0 mt-auto">
          <NozzleAvatar size={20} />
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isNozzle
            ? 'bg-surface-elevated text-foreground rounded-bl-sm'
            : 'bg-brand-700 text-white rounded-br-sm'
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  )
}
