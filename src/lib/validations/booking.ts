import { z } from 'zod'

export const bookingSchema = z.object({
  service_id: z.string().uuid('Selecione um serviço'),
  starts_at: z.string().min(1, 'Selecione um horário'),
  customer_name: z.string().min(3, 'Informe seu nome completo'),
  customer_phone: z.string().min(10, 'Informe um telefone válido'),
  customer_email: z.string().email('Informe um e-mail válido'),
  notes: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>
