import { z } from 'zod'

const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
])

const paymentStatusSchema = z.enum(['pending', 'paid', 'failed', 'refunded'])

const fulfillmentStatusSchema = z.enum([
  'unfulfilled',
  'partial',
  'fulfilled',
  'returned',
])

export const orderFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(20),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    }),
  status: orderStatusSchema.optional().catch(undefined),
  paymentStatus: paymentStatusSchema.optional().catch(undefined),
  fulfillmentStatus: fulfillmentStatusSchema.optional().catch(undefined),
  sort: z
    .string()
    .regex(/^(number|createdAt|total|status):(asc|desc)$/)
    .optional()
    .catch(undefined),
})

export type OrderFilters = z.infer<typeof orderFiltersSchema>

export {
  orderStatusSchema,
  paymentStatusSchema,
  fulfillmentStatusSchema,
}
