/** Форматирование денег/процентов с учётом текущего locale. */
import { i18n, LOCALE_TO_INTL } from '@/shared/config/i18n'
import type { AppLocale } from '@/shared/config/appSettings'

function resolveIntlLocale(locale?: string) {
  const key = (locale ?? i18n.language) as AppLocale
  return LOCALE_TO_INTL[key] ?? LOCALE_TO_INTL.en
}

export function formatMoney(
  value: number,
  currency: string = 'EUR',
  locale?: string,
) {
  return new Intl.NumberFormat(resolveIntlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, locale?: string) {
  return `${new Intl.NumberFormat(resolveIntlLocale(locale), {
    maximumFractionDigits: 1,
  }).format(value)}%`
}
