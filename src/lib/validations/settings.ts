import { z } from 'zod'

export const settingsSchema = z.object({
  hq_cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido — informe 8 dígitos'),
  freight_per_km: z
    .number()
    .positive('Informe um valor maior que zero'),
  delivery_radius_km: z
    .number()
    .positive('Informe um raio maior que zero'),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
