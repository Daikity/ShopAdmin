import { describe, expect, it } from 'vitest'
import { buildDashboardData } from './dashboard.logic'
import { ordersDb } from './data/orders.seed'

describe('dashboard.logic', () => {
  it('агрегирует KPI и серии по периоду', () => {
    const data = buildDashboardData({
      from: '2026-06-01',
      to: '2026-09-07',
    })

    expect(data.kpis.orders).toBeGreaterThan(0)
    expect(data.kpis.revenue).toBeGreaterThan(0)
    expect(data.ordersByStatus).toHaveLength(7)
    expect(data.revenueOverTime.length).toBeGreaterThan(0)
    expect(data.topProducts.length).toBeGreaterThan(0)
    expect(data.recentOrders.length).toBeGreaterThan(0)
    expect(data.kpis.lowStock).toBeGreaterThanOrEqual(0)
  })

  it('пустой период даёт нулевые orders KPI', () => {
    const data = buildDashboardData({
      from: '2099-01-01',
      to: '2099-01-31',
    })
    expect(data.kpis.orders).toBe(0)
    expect(data.kpis.revenue).toBe(0)
    expect(data.recentOrders).toHaveLength(0)
    expect(ordersDb.orders.length).toBeGreaterThanOrEqual(150)
  })
})
