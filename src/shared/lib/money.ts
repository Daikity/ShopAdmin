/** Форматирование денег в EUR для KPI и графиков. */
export function formatMoney(value: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 1,
  }).format(value)}%`
}
