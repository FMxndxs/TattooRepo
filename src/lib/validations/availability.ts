import { z } from 'zod'

export const availabilityRuleSchema = z.object({
  weekday: z.number().int().min(0).max(6, 'Dia inválido'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida: use HH:MM'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida: use HH:MM'),
  is_active: z.boolean(),
})

export const timeOffSchema = z.object({
  starts_at: z.string().min(1, 'Data inicial obrigatória'),
  ends_at: z.string().min(1, 'Data final obrigatória'),
  reason: z.string().nullable().optional(),
}).refine((data) => new Date(data.starts_at) < new Date(data.ends_at), {
  message: 'Data final deve ser posterior à data inicial',
  path: ['ends_at'],
})

export type AvailabilityRuleFormData = z.infer<typeof availabilityRuleSchema>
export type TimeOffFormData = z.infer<typeof timeOffSchema>
