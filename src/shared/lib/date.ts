import { i18n, LOCALE_TO_INTL } from '@/shared/config/i18n'
import type { AppLocale } from '@/shared/config/appSettings'

function resolveIntlLocale(locale?: string) {
  const key = (locale ?? i18n.language) as AppLocale
  return LOCALE_TO_INTL[key] ?? LOCALE_TO_INTL.en
}

/** YYYY-MM-DD из Date (UTC). */
export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

/** Отображение даты/даты-времени по locale UI. */
export function formatDate(value: string | Date, locale?: string) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value: string | Date, locale?: string) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** Парсинг YYYY-MM-DD; невалидные → null. */
export function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return null
  if (toIsoDate(date) !== value) return null
  return date
}

export function compareIsoDates(left: string, right: string) {
  return left.localeCompare(right)
}

/** Сдвиг даты на N дней (UTC). */
export function addUtcDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export function normalizeDateRange<T extends { from?: string; to?: string }>(
  params: T,
): T {
  const { from, to } = params
  if (from && to && compareIsoDates(from, to) > 0) {
    return { ...params, from: to, to: from }
  }
  return params
}

export type DatePeriodPreset = 'today' | '7d' | '30d' | '90d'

/** Диапазон по пресету относительно reference (обычно «сегодня»). */
export function rangeForPeriod(
  period: DatePeriodPreset,
  reference = new Date(),
) {
  const to = toIsoDate(reference)
  if (period === 'today') {
    return { from: to, to }
  }
  const days = period === '7d' ? 6 : period === '30d' ? 29 : 89
  return { from: toIsoDate(addUtcDays(reference, -days)), to }
}

export function detectPeriod(
  from: string | undefined,
  to: string | undefined,
  reference = new Date(),
): DatePeriodPreset | 'custom' {
  if (!from || !to) return '30d'
  const presets: DatePeriodPreset[] = ['today', '7d', '30d', '90d']
  for (const period of presets) {
    const range = rangeForPeriod(period, reference)
    if (range.from === from && range.to === to) return period
  }
  return 'custom'
}
