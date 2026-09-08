import { describe, expect, it } from 'vitest'
import { formatMoney, formatPercent } from './money'
import { formatDate, formatDateTime } from './date'

describe('formatMoney / formatPercent', () => {
  it('форматирует EUR по locale', () => {
    expect(formatMoney(1234.5, 'EUR', 'de')).toMatch(/1\.234,50/)
    expect(formatMoney(1234.5, 'EUR', 'en')).toMatch(/1,234\.50/)
  })

  it('formatPercent учитывает locale', () => {
    expect(formatPercent(12.5, 'de')).toBe('12,5%')
    expect(formatPercent(12.5, 'en')).toBe('12.5%')
  })
})

describe('formatDate / formatDateTime', () => {
  it('formatDate возвращает читаемую дату', () => {
    const value = formatDate('2024-06-15T12:00:00.000Z', 'en')
    expect(value).toMatch(/2024/)
    expect(value).not.toBe('—')
  })

  it('невалидная дата → —', () => {
    expect(formatDate('not-a-date')).toBe('—')
    expect(formatDateTime('not-a-date')).toBe('—')
  })
})
