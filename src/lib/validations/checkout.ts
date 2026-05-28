import { z } from 'zod'

export const checkoutSchema = z.object({
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
