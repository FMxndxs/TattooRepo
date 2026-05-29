import { z } from 'zod'

export const customOrderSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  phone: z.string().min(10, 'Informe um telefone válido'),
  description: z.string().min(20, 'Descreva com ao menos 20 caracteres'),
  reference_url: z
    .union([z.literal(''), z.string().url('URL inválida'), z.null()])
    .transform((v) => (!v ? null : v)),
  color_name: z.string().min(1, 'Selecione uma cor'),
})

export type CustomOrderFormData = z.infer<typeof customOrderSchema>
export type CustomOrderFormInput = z.input<typeof customOrderSchema>
