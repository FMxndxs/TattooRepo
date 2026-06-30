import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  slug: z
    .string()
    .min(2, 'Slug obrigatório')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido: use apenas letras minúsculas, números e hifens'),
  description: z.string().nullable().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  category_id: z.string().uuid().nullable().optional(),
  print_time_minutes: z.number().int().min(0).nullable().optional(),
  filament_grams: z.number().min(0).nullable().optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  allows_custom_color: z.boolean().default(true),
  allows_custom_size: z.boolean().default(false),
  makerworld_url: z
    .string()
    .trim()
    .url('URL inválida')
    .or(z.literal(''))
    .nullable()
    .optional(),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductFormInput = z.input<typeof productSchema>
