import { z } from 'zod'
import {
  detectPeriod,
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

const periodSchema = z
  .enum(['today', '7d', '30d', '90d', 'custom'])
  .optional()
  .catch(undefined)

export const dashboardFiltersSchema = z
  .object({
    from: optionalIsoDate,
    to: optionalIsoDate,
    period: periodSchema,
  })
  .transform((fields) => {
    const reference = new Date()
    let from = fields.from
    let to = fields.to
    let period = fields.period

    if (period && period !== 'custom') {
      const range = rangeForPeriod(period, reference)
      from = range.from
      to = range.to
    } else if (!from || !to) {
      const range = rangeForPeriod('30d', reference)
      from = from ?? range.from
      to = to ?? range.to
      period = detectPeriod(from, to, reference)
    } else {
      const normalized = normalizeDateRange({ from, to })
      from = normalized.from
      to = normalized.to
      // Явный custom не перезаписываем, даже если даты совпали с пресетом
      if (period !== 'custom') {
        period = detectPeriod(from, to, reference)
      }
    }

    return {
      from: from ?? rangeForPeriod('30d', reference).from,
      to: to ?? rangeForPeriod('30d', reference).to,
      period: period ?? 'custom',
    }
  })

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
