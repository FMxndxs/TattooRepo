import { mapAuthError } from '@/lib/utils/authErrors'

describe('mapAuthError', () => {
  describe('context: login', () => {
    it('mapeia "Email not confirmed" para orientação de confirmação', () => {
      const result = mapAuthError('Email not confirmed', 'login')
      expect(result).toMatch(/confirme seu e-mail/i)
    })

    it('mapeia "Invalid login credentials" para mensagem genérica', () => {
      const result = mapAuthError('Invalid login credentials', 'login')
      expect(result).toMatch(/e-mail ou senha incorretos/i)
    })

    it('mapeia "invalid_credentials" para mensagem genérica', () => {
      const result = mapAuthError('invalid_credentials', 'login')
      expect(result).toMatch(/e-mail ou senha incorretos/i)
    })

    it('retorna fallback de login para erros desconhecidos', () => {
      const result = mapAuthError('some unknown supabase error', 'login')
      expect(result).toMatch(/e-mail ou senha incorretos/i)
    })

    it('mapeia "Email rate limit exceeded"', () => {
      const result = mapAuthError('Email rate limit exceeded', 'login')
      expect(result).toMatch(/muitas tentativas/i)
    })
  })

  describe('context: signup', () => {
    it('mapeia "User already registered" para aviso de e-mail existente', () => {
      const result = mapAuthError('User already registered', 'signup')
      expect(result).toMatch(/já está cadastrado/i)
    })

    it('mapeia "email address is already registered"', () => {
      const result = mapAuthError('email address is already registered', 'signup')
      expect(result).toMatch(/já está cadastrado/i)
    })

    it('retorna fallback de signup para erros desconhecidos', () => {
      const result = mapAuthError('some unknown error', 'signup')
      expect(result).toMatch(/não foi possível criar a conta/i)
    })

    it('é case-insensitive na comparação', () => {
      const result = mapAuthError('USER ALREADY REGISTERED', 'signup')
      expect(result).toMatch(/já está cadastrado/i)
    })
  })
})
