import { describe, expect, it } from 'vitest'
import { dashboardFiltersSchema } from '@/entities/dashboard'
import { rangeForPeriod } from '@/shared/lib/date'

describe('dashboardFiltersSchema', () => {
  it('по умолчанию выставляет 30d', () => {
    const parsed = dashboardFiltersSchema.parse({})
    const expected = rangeForPeriod('30d')
    expect(parsed.period).toBe('30d')
    expect(parsed.from).toBe(expected.from)
    expect(parsed.to).toBe(expected.to)
  })

  it('пресет 7d пересчитывает from/to', () => {
    const parsed = dashboardFiltersSchema.parse({ period: '7d' })
    const expected = rangeForPeriod('7d')
    expect(parsed.from).toBe(expected.from)
    expect(parsed.to).toBe(expected.to)
    expect(parsed.period).toBe('7d')
  })

  it('меняет местами from > to', () => {
    const parsed = dashboardFiltersSchema.parse({
      from: '2026-09-01',
      to: '2026-08-01',
      period: 'custom',
    })
    expect(parsed.from).toBe('2026-08-01')
    expect(parsed.to).toBe('2026-09-01')
    expect(parsed.period).toBe('custom')
  })

  it('невалидные даты падают в дефолтный 30d', () => {
    const parsed = dashboardFiltersSchema.parse({
      from: 'not-a-date',
      to: 'also-bad',
    })
    const expected = rangeForPeriod('30d')
    expect(parsed.from).toBe(expected.from)
    expect(parsed.to).toBe(expected.to)
  })
})
