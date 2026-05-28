import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'

describe('loginSchema', () => {
  it('aceita dados validos', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: 'abcdef' })
    expect(result.success).toBe(true)
  })

  it('rejeita email invalido', () => {
    const result = loginSchema.safeParse({ email: 'nao-e-email', password: 'abcdef' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha muito curta', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: '123' })
    expect(result.success).toBe(false)
  })
})

describe('signupSchema', () => {
  const valid = {
    first_name: 'Felipe',
    last_name: 'Mendes',
    phone: '(11) 98952-5014',
    email: 'test@test.com',
    email_confirm: 'test@test.com',
    password: 'senha123',
    password_confirm: 'senha123',
  }

  it('aceita dados validos', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true)
  })

  it('rejeita nome muito curto', () => {
    const result = signupSchema.safeParse({ ...valid, first_name: 'F' })
    expect(result.success).toBe(false)
  })

  it('rejeita telefone sem mascara', () => {
    const result = signupSchema.safeParse({ ...valid, phone: '11989525014' })
    expect(result.success).toBe(false)
  })

  it('rejeita quando emails nao coincidem', () => {
    const result = signupSchema.safeParse({ ...valid, email_confirm: 'outro@test.com' })
    expect(result.success).toBe(false)
  })

  it('rejeita quando senhas nao coincidem', () => {
    const result = signupSchema.safeParse({ ...valid, password_confirm: 'diferente' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha menor que 8 caracteres', () => {
    const result = signupSchema.safeParse({ ...valid, password: 'abc', password_confirm: 'abc' })
    expect(result.success).toBe(false)
  })
})

describe('forgotPasswordSchema', () => {
  it('aceita email valido', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'test@test.com' }).success).toBe(true)
  })

  it('rejeita email invalido', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'invalido' }).success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('aceita senhas iguais e validas', () => {
    expect(resetPasswordSchema.safeParse({ password: 'nova1234', password_confirm: 'nova1234' }).success).toBe(true)
  })

  it('rejeita senhas que nao coincidem', () => {
    expect(resetPasswordSchema.safeParse({ password: 'nova1234', password_confirm: 'diferente' }).success).toBe(false)
  })
})
