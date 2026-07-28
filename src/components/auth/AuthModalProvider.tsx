'use client'

import { useEffect } from 'react'
import { AuthModal } from './AuthModal'
import { useAuthModalStore } from '@/lib/store/authModalStore'
import { useAuth } from '@/lib/context/AuthContext'

/**
 * Global provider that renders the AuthModal and watches for auth state changes
 * to execute pending actions after successful login/signup.
 */
export function AuthModalProvider() {
  const { isOpen, defaultTab, closeModal, executePendingAction, clearPendingAction } =
    useAuthModalStore()
  const { isAuthenticated } = useAuth()

  // When user becomes authenticated while modal was open, execute pending action
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      closeModal()
      executePendingAction()
    }
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    clearPendingAction()
    closeModal()
  }

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      defaultTab={defaultTab}
    />
  )
}
