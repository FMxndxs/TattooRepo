import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(10, 'Telefone obrigatório'),
  cep: z.string().regex(/^\d{8}$/, 'CEP inválido — informe 8 dígitos'),
  number: z.string().min(1, 'Número obrigatório'),
  street: z.string().min(2, 'Rua obrigatória'),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
