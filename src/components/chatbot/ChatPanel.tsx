'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useChatStore } from '@/lib/store/chatStore'
import { getNode, getRootNode, registerNodes } from '@/lib/chatbot/engine'
import { allNodes } from '@/lib/chatbot/trees'
import { buildSupportUrl } from '@/lib/utils/whatsapp'
import { FilamentBackdrop } from '@/components/ui/FilamentBackdrop'
import { ChatBubble } from './ChatBubble'
import { ChatOptions } from './ChatOptions'
import { NozzleAvatar } from './NozzleAvatar'
import { TypingIndicator } from './TypingIndicator'
import { ProductPreviewList } from './ProductPreviewList'
import type { ChatOption } from '@/lib/chatbot/types'

// Register all nodes once
registerNodes(allNodes)

export function ChatPanel() {
  const { messages, isTyping, addUserMessage, addNozzleMessage, setTyping, reset } = useChatStore()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const bootedRef = useRef(false)

  // Boot: use ref to survive StrictMode double-invoke and Drawer re-mounts
  useEffect(() => {
    if (bootedRef.current) return
    bootedRef.current = true
    if (useChatStore.getState().messages.length === 0) {
      const root = getRootNode()
      if (root) addNozzleMessage(root.message, root.id, root.options)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll to bottom on new messages or typing state change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function handleOption(option: ChatOption) {
    addUserMessage(option.label)

    const node = getNode(option.nextNodeId)
    if (!node) return

    setTyping(true)

    setTimeout(() => {
      setTyping(false)

      if (node.action) {
        if (node.action.type === 'navigate' && node.action.payload) {
          addNozzleMessage(node.message, node.id, node.options)
          setTimeout(() => router.push(node.action!.payload!), 400)
          return
        }
        if (node.action.type === 'open-whatsapp' && node.action.payload) {
          addNozzleMessage(node.message, node.id, node.options)
          setTimeout(() => window.open(buildSupportUrl(node.action!.payload!), '_blank'), 300)
          return
        }
      }

      addNozzleMessage(
        node.message,
        node.id,
        node.options,
        node.categorySlug,
        node.showProducts,
        node.subFilter,
      )
    }, 350)
  }

  function handleReset() {
    reset()
    const root = getRootNode()
    if (root) {
      addNozzleMessage(root.message, root.id, root.options)
    }
  }

  const lastNozzleMsg = [...messages].reverse().find((m) => m.from === 'nozzle')
  const activeOptions = isTyping ? undefined : lastNozzleMsg?.options

  return (
    <div className="flex flex-col h-full">
      {/* Header with FilamentBackdrop */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 shrink-0 overflow-hidden isolate">
        <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
          <FilamentBackdrop />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 flex items-center justify-center">
            <NozzleAvatar size={22} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Nozzle</p>
            <p className="text-zinc-500 text-xs">Assistente Imagination 3D</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Reiniciar conversa"
          className="relative z-10 text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg}>
            {msg.showProducts && msg.categorySlug ? (
              <ProductPreviewList
                categorySlug={msg.categorySlug}
                subFilter={msg.subFilter}
              />
            ) : undefined}
          </ChatBubble>
        ))}

        <AnimatePresence>
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>
      </div>

      {/* Options */}
      {activeOptions && activeOptions.length > 0 && (
        <div className="px-4 py-3 border-t border-zinc-800/60 shrink-0">
          <ChatOptions options={activeOptions} onSelect={handleOption} />
        </div>
      )}
    </div>
  )
}
