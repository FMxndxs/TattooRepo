import { z } from 'zod'

export const promotionSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().nullable(),
  valid_from: z.string().date().nullable(),
  valid_until: z.string().date().nullable(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
})

export type PromotionFormData = z.infer<typeof promotionSchema>
export type PromotionFormInput = z.input<typeof promotionSchema>
