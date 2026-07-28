'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Phone, Mail, Lock, Loader2, CheckCircle } from 'lucide-react'
import { signupSchema, type SignupFormData } from '@/lib/validations/auth'
import { useAuth } from '@/lib/context/AuthContext'
import { formatPhoneBR } from '@/lib/utils/phoneMask'
import { mapAuthError } from '@/lib/utils/authErrors'

interface SignupFormProps {
  onSuccess: () => void
}

const inputClass =
  'w-full bg-surface-elevated border border-border-strong text-foreground placeholder:text-foreground-subtle rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-brand-500 transition-colors'

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [emailConfirmation, setEmailConfirmation] = useState(false)
  const [phoneValue, setPhoneValue] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) })

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneBR(e.target.value)
    setPhoneValue(formatted)
    setValue('phone', formatted, { shouldValidate: true })
  }

  async function onSubmit(data: SignupFormData) {
    setServerError(null)
    setEmailConfirmation(false)
    const { error } = await signUp({
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
    })
    if (error === 'EMAIL_NOT_CONFIRMED') {
      // Confirmation email sent — show guidance instead of closing
      setEmailConfirmation(true)
      return
    }
    if (error) {
      setServerError(mapAuthError(error, 'signup'))
      return
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      {/* Nome + Sobrenome */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-first" className="block text-foreground text-sm font-medium mb-1.5">
            Nome
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
            <input
              id="signup-first"
              placeholder="Felipe"
              autoComplete="given-name"
              {...register('first_name')}
              className={inputClass}
            />
          </div>
          {errors.first_name && (
            <p role="alert" className="text-red-400 text-xs mt-1">{errors.first_name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="signup-last" className="block text-foreground text-sm font-medium mb-1.5">
            Sobrenome
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
            <input
              id="signup-last"
              placeholder="Mendes"
              autoComplete="family-name"
              {...register('last_name')}
              className={inputClass}
            />
          </div>
          {errors.last_name && (
            <p role="alert" className="text-red-400 text-xs mt-1">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      {/* Telefone */}
      <div>
        <label htmlFor="signup-phone" className="block text-foreground text-sm font-medium mb-1.5">
          Telefone
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="signup-phone"
            type="tel"
            placeholder="(11) 98765-4321"
            autoComplete="tel"
            value={phoneValue}
            onChange={handlePhoneChange}
            className={inputClass}
          />
          {/* Register hidden so RHF tracks value */}
          <input type="hidden" {...register('phone')} />
        </div>
        {errors.phone && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* E-mail */}
      <div>
        <label htmlFor="signup-email" className="block text-foreground text-sm font-medium mb-1.5">
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="signup-email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            {...register('email')}
            className={inputClass}
          />
        </div>
        {errors.email && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Confirmar E-mail */}
      <div>
        <label htmlFor="signup-email-confirm" className="block text-foreground text-sm font-medium mb-1.5">
          Confirmar e-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="signup-email-confirm"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            {...register('email_confirm')}
            className={inputClass}
          />
        </div>
        {errors.email_confirm && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.email_confirm.message}</p>
        )}
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="signup-password" className="block text-foreground text-sm font-medium mb-1.5">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password')}
            className={inputClass}
          />
        </div>
        {errors.password && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmar Senha */}
      <div>
        <label htmlFor="signup-password-confirm" className="block text-foreground text-sm font-medium mb-1.5">
          Confirmar senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="signup-password-confirm"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password_confirm')}
            className={inputClass}
          />
        </div>
        {errors.password_confirm && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.password_confirm.message}</p>
        )}
      </div>

      {/* Email confirmation notice */}
      {emailConfirmation && (
        <div role="status" className="flex items-start gap-2 text-green-400 text-xs bg-green-400/10 rounded-lg py-2 px-3">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Conta criada! Confirme pelo link enviado ao seu e-mail antes de entrar.</span>
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <p role="alert" className="text-red-400 text-xs text-center bg-red-400/10 rounded-lg py-2 px-3">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full overflow-hidden flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors text-sm print-cta-sheen mt-2"
      >
        <span className="print-cta-filament opacity-75" aria-hidden />
        <span className="relative z-10 flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </span>
      </button>
    </form>
  )
}
