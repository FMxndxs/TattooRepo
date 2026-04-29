import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido').max(15),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
