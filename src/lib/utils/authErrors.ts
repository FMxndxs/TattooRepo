type AuthContext = 'login' | 'signup'

const KNOWN_ERRORS: Record<string, Partial<Record<AuthContext, string>>> = {
  'Email not confirmed': {
    login: 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.',
  },
  'Invalid login credentials': {
    login: 'E-mail ou senha incorretos. Verifique seus dados.',
  },
  'invalid_credentials': {
    login: 'E-mail ou senha incorretos. Verifique seus dados.',
  },
  'User already registered': {
    signup: 'Este e-mail já está cadastrado. Tente entrar ou recupere sua senha.',
  },
  'email address is already registered': {
    signup: 'Este e-mail já está cadastrado. Tente entrar ou recupere sua senha.',
  },
  'Password should be at least': {
    signup: 'A senha deve ter ao menos 8 caracteres.',
    login: 'A senha deve ter ao menos 6 caracteres.',
  },
  'Email rate limit exceeded': {
    signup: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    login: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  },
}

const FALLBACK: Record<AuthContext, string> = {
  login: 'E-mail ou senha incorretos. Verifique seus dados.',
  signup: 'Não foi possível criar a conta. Tente novamente.',
}

/**
 * Maps a raw Supabase error message to a user-friendly Portuguese string.
 * Context-specific when the message means different things for login vs signup.
 */
export function mapAuthError(message: string, context: AuthContext): string {
  for (const [key, map] of Object.entries(KNOWN_ERRORS)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return map[context] ?? map['login'] ?? map['signup'] ?? FALLBACK[context]
    }
  }
  return FALLBACK[context]
}
