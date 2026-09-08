import { z } from 'zod'

const returnStatusSchema = z.enum([
  'requested',
  'approved',
  'rejected',
  'received',
  'refunded',
])

export const returnFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(20),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    }),
  status: returnStatusSchema.optional().catch(undefined),
  sort: z
    .string()
    .regex(/^(number|amount|createdAt|status):(asc|desc)$/)
    .optional()
    .catch(undefined),
})

export type ReturnFilters = z.infer<typeof returnFiltersSchema>
