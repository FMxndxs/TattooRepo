'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { useChatStore } from '@/lib/store/chatStore'
import { getNode, getRootNode, registerNodes } from '@/lib/chatbot/engine'
import { allNodes } from '@/lib/chatbot/trees'
import { buildSupportUrl } from '@/lib/utils/whatsapp'
import { ChatBubble } from './ChatBubble'
import { ChatOptions } from './ChatOptions'
import { NozzleAvatar } from './NozzleAvatar'
import type { ChatOption } from '@/lib/chatbot/types'

// Register all nodes once
registerNodes(allNodes)

export function ChatPanel() {
  const { messages, addUserMessage, addNozzleMessage, reset } = useChatStore()
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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function handleOption(option: ChatOption) {
    // Add user bubble
    addUserMessage(option.label)

    const node = getNode(option.nextNodeId)
    if (!node) return

    // Handle action nodes
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

    addNozzleMessage(node.message, node.id, node.options)
  }

  function handleReset() {
    reset()
    const root = getRootNode()
    if (root) {
      addNozzleMessage(root.message, root.id, root.options)
    }
  }

  // Get last message options to show
  const lastNozzleMsg = [...messages].reverse().find((m) => m.from === 'nozzle')
  const activeOptions = lastNozzleMsg?.options

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 flex items-center justify-center">
            <NozzleAvatar size={22} />
          </div>
          <div>
            <p className="text-foreground font-semibold text-sm">Nozzle</p>
            <p className="text-foreground-subtle text-xs">Assistente Imagination 3D</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reiniciar conversa"
          className="text-foreground-subtle hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-surface-elevated"
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
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Options area */}
      {activeOptions && activeOptions.length > 0 && (
        <div className="px-4 py-3 border-t border-border/60 shrink-0">
          <ChatOptions options={activeOptions} onSelect={handleOption} />
        </div>
      )}
    </div>
  )
}
