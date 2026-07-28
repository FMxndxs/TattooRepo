import { create } from 'zustand'
import type { AuthTab } from '@/components/auth/AuthModal'

interface PendingAction {
  fn: () => void
}

interface AuthModalStore {
  isOpen: boolean
  defaultTab: AuthTab
  pendingAction: PendingAction | null
  openModal: (tab?: AuthTab, pendingAction?: PendingAction) => void
  closeModal: () => void
  executePendingAction: () => void
  clearPendingAction: () => void
}

export const useAuthModalStore = create<AuthModalStore>((set, get) => ({
  isOpen: false,
  defaultTab: 'login',
  pendingAction: null,

  openModal(tab = 'login', pendingAction) {
    set({ isOpen: true, defaultTab: tab, pendingAction: pendingAction ?? null })
  },

  closeModal() {
    set({ isOpen: false })
  },

  executePendingAction() {
    const { pendingAction } = get()
    if (pendingAction) {
      pendingAction.fn()
      set({ pendingAction: null })
    }
  },

  clearPendingAction() {
    set({ pendingAction: null })
  },
}))
