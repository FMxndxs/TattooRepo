'use client'

import { motion, useReducedMotion } from 'motion/react'
import { NozzleAvatar } from './NozzleAvatar'
import type { ChatMessage } from '@/lib/chatbot/types' 

interface ChatBubbleProps {
  message: ChatMessage
  children?: React.ReactNode
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function ChatBubble({ message, children }: ChatBubbleProps) {
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
        <div className="w-8 h-8 rounded-full ring-1 ring-brand-500/40 overflow-hidden shrink-0 mt-auto">
          <NozzleAvatar size={32} />
        </div>
      )}

      <div className={`flex flex-col gap-0.5 ${isNozzle ? 'items-start' : 'items-end'} max-w-[84%]`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isNozzle
              ? 'bg-surface-elevated text-foreground rounded-bl-sm'
              : 'bg-brand-700 text-white rounded-br-sm'
          }`}
        >
          {message.text}
        </div>
 
        {/* Inline product cards for nozzle product-list messages */}
        {children && (
          <div className="w-full mt-0.5">
            {children}
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] text-zinc-600 tabular-nums px-1 ${isNozzle ? 'self-start' : 'self-end'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  )
}
