import { describe, expect, it } from 'vitest'
import { buildReportsData, filterOrdersForReports } from './reports.logic'

describe('reports.logic', () => {
  it('строит reports с KPI и breakdown', () => {
    const data = buildReportsData({
      from: '2026-06-01',
      to: '2026-09-07',
    })
    expect(data.kpis.orders).toBeGreaterThan(0)
    expect(data.revenueOverTime.length).toBeGreaterThan(0)
    expect(data.ordersOverTime.length).toBeGreaterThan(0)
    expect(data.byCategory.length).toBeGreaterThan(0)
    expect(data.topProducts.length).toBeGreaterThan(0)
    expect(data.byCustomer.length).toBeGreaterThan(0)
  })

  it('фильтрует по paymentStatus', () => {
    const paid = filterOrdersForReports({
      from: '2026-01-01',
      to: '2026-12-31',
      paymentStatus: 'paid',
    })
    expect(paid.length).toBeGreaterThan(0)
    expect(paid.every((order) => order.paymentStatus === 'paid')).toBe(true)
  })

  it('фильтрует по customerId', () => {
    const filtered = filterOrdersForReports({
      from: '2026-01-01',
      to: '2026-12-31',
      customerId: 'cust-001',
    })
    expect(filtered.every((order) => order.customerId === 'cust-001')).toBe(
      true,
    )
  })
})
