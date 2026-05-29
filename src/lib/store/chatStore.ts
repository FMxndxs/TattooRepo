import { create } from 'zustand'
import type { ChatMessage, ChatOption, ChatSubFilter } from '@/lib/chatbot/types'

interface ChatStore {
  isDrawerOpen: boolean
  isTyping: boolean
  messages: ChatMessage[]
  currentNodeId: string
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  setTyping: (value: boolean) => void
  addUserMessage: (text: string, options?: ChatOption[]) => void
  addNozzleMessage: (
    text: string,
    nodeId: string,
    options?: ChatOption[],
    categorySlug?: string,
    showProducts?: boolean,
    subFilter?: ChatSubFilter,
  ) => void
  reset: () => void
}

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

export const useChatStore = create<ChatStore>((set) => ({
  isDrawerOpen: false,
  isTyping: false,
  messages: [],
  currentNodeId: 'root',

  openChat() {
    set({ isDrawerOpen: true })
  },

  closeChat() {
    set({ isDrawerOpen: false })
  },

  toggleChat() {
    set((s) => ({ isDrawerOpen: !s.isDrawerOpen }))
  },

  setTyping(value) {
    set({ isTyping: value })
  },

  addUserMessage(text, options) {
    set((s) => ({
      messages: [
        ...s.messages,
        { id: makeId(), from: 'user', text, timestamp: Date.now(), options },
      ],
    }))
  },

  addNozzleMessage(text, nodeId, options, categorySlug, showProducts, subFilter) {
    set((s) => ({
      currentNodeId: nodeId,
      messages: [
        ...s.messages,
        {
          id: makeId(),
          from: 'nozzle',
          text,
          timestamp: Date.now(),
          options,
          nodeId,
          categorySlug,
          showProducts,
          subFilter,
        },
      ],
    }))
  },

  reset() {
    set({ messages: [], currentNodeId: 'root', isTyping: false })
  },
}))
