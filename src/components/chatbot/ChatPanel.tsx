'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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
import { NozzleProfile } from './NozzleProfile'
import type { ChatOption } from '@/lib/chatbot/types'

// Register all nodes once
registerNodes(allNodes)

type Tab = 'chat' | 'profile'

export function ChatPanel() {
  const { messages, isTyping, addUserMessage, addNozzleMessage, setTyping, reset, closeChat } = useChatStore()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const bootedRef = useRef(false)
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const reduced = useReducedMotion()

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
          setTimeout(() => {
            closeChat()
            router.push(node.action!.payload!)
          }, 400)
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
          <div className="w-9 h-9 rounded-full ring-1 ring-brand-500/40 overflow-hidden shrink-0">
            <NozzleAvatar size={36} />
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

      {/* Tab bar */}
      <div className="flex border-b border-zinc-800/60 shrink-0 bg-zinc-950/60">
        {([
          { id: 'chat' as Tab, label: '💬 Chat' },
          { id: 'profile' as Tab, label: '🎮 Nozzle' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 py-2 text-xs font-semibold tracking-wide transition-colors ${
              activeTab === tab.id
                ? 'text-brand-300'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute bottom-0 inset-x-4 h-[2px] rounded-full bg-brand-500"
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-hidden"
          >
            <NozzleProfile onSwitchToChat={() => setActiveTab('chat')} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col flex-1 overflow-hidden"
          >
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
                <ChatOptions options={activeOptions} onSelect={handleOption} disabled={isTyping} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
