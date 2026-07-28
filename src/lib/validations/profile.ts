import { z } from 'zod'

export const profileEditSchema = z.object({
  phone: z
    .string()
    .min(14, 'Telefone inválido')
    .max(15, 'Telefone inválido')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Use o formato (11) 98765-4321'),
  neighborhood: z.string().min(2, 'Bairro deve ter ao menos 2 caracteres').trim(),
  city: z.string().min(2, 'Cidade deve ter ao menos 2 caracteres').trim(),
})

export type ProfileEditFormData = z.infer<typeof profileEditSchema>
