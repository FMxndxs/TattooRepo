'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Bot } from 'lucide-react'
import { useChatStore } from '@/lib/store/chatStore'
import { Drawer } from '@/components/ui/Drawer'
import { ChatPanel } from '@/components/chatbot/ChatPanel'

export function ChatIcon() {
  const { isDrawerOpen, openChat, closeChat } = useChatStore()
  const reduced = useReducedMotion()

  return (
    <>
      <motion.button
        type="button"
        onClick={openChat}
        aria-label="Abrir chat de ajuda"
        whileHover={reduced ? undefined : { scale: 1.08 }}
        whileTap={reduced ? undefined : { scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 480, damping: 26 }}
        className="relative flex items-center justify-center w-9 h-9 rounded-full border border-zinc-700/60 text-zinc-400 hover:text-brand-300 hover:border-brand-500/60 hover:bg-brand-700/10 transition-colors"
      >
        <Bot className="w-[18px] h-[18px]" />
      </motion.button>

      <Drawer isOpen={isDrawerOpen} onClose={closeChat} width="w-full sm:w-[400px]">
        <ChatPanel />
      </Drawer>
    </>
  )
}
