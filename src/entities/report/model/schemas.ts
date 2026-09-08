import { z } from 'zod'
import { paymentStatusSchema } from '@/entities/order'
import {
  normalizeDateRange,
  parseIsoDate,
  rangeForPeriod,
} from '@/shared/lib/date'

const optionalIsoDate = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) return undefined
    return parseIsoDate(value) ? value : undefined
  })
  .catch(undefined)

const optionalId = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim()
    return trimmed ? trimmed : undefined
  })

export const reportsFiltersSchema = z
  .object({
    from: optionalIsoDate,
    to: optionalIsoDate,
    categoryId: optionalId,
    productId: optionalId,
    customerId: optionalId,
    paymentStatus: paymentStatusSchema.optional().catch(undefined),
  })
  .transform((fields) => {
    const defaults = rangeForPeriod('30d')
    const from = fields.from ?? defaults.from
    const to = fields.to ?? defaults.to
    return normalizeDateRange({
      ...fields,
      from,
      to,
    })
  })

export type ReportsFilters = z.infer<typeof reportsFiltersSchema>
