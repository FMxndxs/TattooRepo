import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    first_name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').trim(),
    last_name: z.string().min(2, 'Sobrenome deve ter ao menos 2 caracteres').trim(),
    phone: z
      .string()
      .min(14, 'Telefone inválido')
      .max(15, 'Telefone inválido')
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Use o formato (11) 98765-4321'),
    email: z.string().email('E-mail inválido'),
    email_confirm: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
    password_confirm: z.string().min(8, 'Confirme a senha'),
  })
  .refine((d) => d.email === d.email_confirm, {
    message: 'Os e-mails não coincidem',
    path: ['email_confirm'],
  })
  .refine((d) => d.password === d.password_confirm, {
    message: 'As senhas não coincidem',
    path: ['password_confirm'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
    password_confirm: z.string().min(8, 'Confirme a senha'),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: 'As senhas não coincidem',
    path: ['password_confirm'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
