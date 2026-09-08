import { z } from 'zod'
import {
  normalizeDateRange,
  parseIsoDate,
} from '@/shared/lib/date'

const optionalIsoDate = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) return undefined
    return parseIsoDate(value) ? value : undefined
  })
  .catch(undefined)

const optionalText = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim()
    return trimmed ? trimmed : undefined
  })

export const auditFiltersSchema = z
  .object({
    page: z.coerce.number().int().positive().catch(1),
    limit: z.coerce.number().int().positive().max(100).catch(20),
    user: optionalText,
    action: optionalText,
    entity: optionalText,
    from: optionalIsoDate,
    to: optionalIsoDate,
  })
  .transform((fields) => normalizeDateRange(fields))

export type AuditFilters = z.infer<typeof auditFiltersSchema>
