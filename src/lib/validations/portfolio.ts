import { z } from 'zod'

export const portfolioSchema = z.object({
  title: z.string().nullable(),
  style: z.string().nullable(),
  body_placement: z.string().nullable(),
  sort_order: z.number().int(),
})

export type PortfolioFormData = z.infer<typeof portfolioSchema>
export type PortfolioFormInput = z.input<typeof portfolioSchema>
