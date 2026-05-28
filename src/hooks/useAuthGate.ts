'use client'

import { useCallback } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { useAuthModalStore } from '@/lib/store/authModalStore'

/**
 * Returns a `requireAuth` function.
 * If the user is authenticated, calls `callback` immediately.
 * If not, opens the auth modal and stores the callback as a pending action.
 * The pending action is executed after successful login/signup.
 */
export function useAuthGate() {
  const { isAuthenticated } = useAuth()
  const openModal = useAuthModalStore((s) => s.openModal)

  const requireAuth = useCallback(
    (callback: () => void) => {
      if (isAuthenticated) {
        callback()
      } else {
        openModal('login', { fn: callback })
      }
    },
    [isAuthenticated, openModal],
  )

  return { requireAuth }
}
