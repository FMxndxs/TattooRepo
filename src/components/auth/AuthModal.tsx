'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Layers } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export type AuthTab = 'login' | 'signup' | 'forgot'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: AuthTab
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(defaultTab)
  const reduced = useReducedMotion()

  function handleSuccess() {
    onClose()
  }

  const tabs: { id: AuthTab; label: string }[] = [
    { id: 'login', label: 'Entrar' },
    { id: 'signup', label: 'Criar conta' },
  ]

  const titles: Record<AuthTab, string> = {
    login: 'Entrar na sua conta',
    signup: 'Criar nova conta',
    forgot: 'Recuperar senha',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      {/* Header com logo 3D */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 mb-3">
          <Layers className="w-5 h-5 text-brand-300" />
        </div>
        <h2 className="text-foreground font-bold text-lg">{titles[tab]}</h2>
      </div>

      {/* Tabs — only show for login/signup */}
      {tab !== 'forgot' && (
        <div className="relative flex bg-surface-elevated/80 rounded-xl p-1 mb-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex-1 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
                tab === t.id ? 'text-foreground' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="auth-tab-bg"
                  className="absolute inset-0 bg-brand-700 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}

          {/* 3D layer decoration on active tab */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden"
          >
            <div className="h-full bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
          </div>
        </div>
      )}

      {/* Form content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: reduced ? 0.06 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === 'login' && (
            <LoginForm
              onSuccess={handleSuccess}
              onForgotPassword={() => setTab('forgot')}
            />
          )}
          {tab === 'signup' && (
            <SignupForm onSuccess={handleSuccess} />
          )}
          {tab === 'forgot' && (
            <ForgotPasswordForm onBack={() => setTab('login')} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom decoration */}
      <div
        aria-hidden
        className="mt-5 text-center text-foreground-subtle text-xs flex items-center gap-2 justify-center"
      >
        <div className="h-px flex-1 bg-border" />
        Kadu Freitas Tattoo
        <div className="h-px flex-1 bg-border" />
      </div>
    </Modal>
  )
}
