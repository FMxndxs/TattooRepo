import { z } from 'zod'

export const serviceSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  slug: z
    .string()
    .min(2, 'Slug obrigatório')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido: use apenas letras minúsculas, números e hifens'),
  description: z.string().nullable().optional(),
  duration_min: z.number().int().positive('Duração deve ser maior que zero'),
  deposit_amount: z.number().nonnegative('Valor do sinal não pode ser negativo'),
  price_from: z.number().positive('Preço deve ser maior que zero').nullable().optional(),
  is_active: z.boolean(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
