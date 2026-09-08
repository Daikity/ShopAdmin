import { z } from 'zod'

const customerStatusSchema = z.enum(['active', 'blocked', 'invited'])

export const customerFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(20),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    }),
  status: customerStatusSchema.optional().catch(undefined),
  sort: z
    .string()
    .regex(/^(name|ordersCount|totalSpent|createdAt|lastOrderAt):(asc|desc)$/)
    .optional()
    .catch(undefined),
})

export type CustomerFilters = z.infer<typeof customerFiltersSchema>
