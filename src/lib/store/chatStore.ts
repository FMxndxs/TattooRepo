import { create } from 'zustand'
import type { ChatMessage, ChatOption } from '@/lib/chatbot/types'

interface ChatStore {
  isDrawerOpen: boolean
  messages: ChatMessage[]
  currentNodeId: string
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  addUserMessage: (text: string, options?: ChatOption[]) => void
  addNozzleMessage: (text: string, nodeId: string, options?: ChatOption[]) => void
  reset: () => void
}

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

export const useChatStore = create<ChatStore>((set) => ({
  isDrawerOpen: false,
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

  addUserMessage(text, options) {
    set((s) => ({
      messages: [
        ...s.messages,
        { id: makeId(), from: 'user', text, timestamp: Date.now(), options },
      ],
    }))
  },

  addNozzleMessage(text, nodeId, options) {
    set((s) => ({
      currentNodeId: nodeId,
      messages: [
        ...s.messages,
        { id: makeId(), from: 'nozzle', text, timestamp: Date.now(), options, nodeId },
      ],
    }))
  },

  reset() {
    set({ messages: [], currentNodeId: 'root' })
  },
}))
