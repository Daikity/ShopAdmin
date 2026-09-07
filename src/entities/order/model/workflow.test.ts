import { describe, expect, it } from 'vitest'
import {
  canChangeOrderStatus,
  canPerformOrderAction,
  getAllowedNextStatuses,
  getAvailableOrderActions,
} from './workflow'

describe('order workflow', () => {
  it('разрешает только валидные переходы', () => {
    expect(canChangeOrderStatus('pending', 'confirmed')).toBe(true)
    expect(canChangeOrderStatus('pending', 'cancelled')).toBe(true)
    expect(canChangeOrderStatus('pending', 'shipped')).toBe(false)
    expect(canChangeOrderStatus('delivered', 'processing')).toBe(false)
    expect(canChangeOrderStatus('delivered', 'refunded')).toBe(true)
  })

  it('не даёт выйти из terminal-статусов', () => {
    expect(getAllowedNextStatuses('cancelled')).toEqual([])
    expect(getAllowedNextStatuses('refunded')).toEqual([])
  })

  it('маппит actions на доступные статусы', () => {
    expect(canPerformOrderAction('confirmed', 'start_fulfillment')).toBe(true)
    expect(canPerformOrderAction('confirmed', 'ship')).toBe(false)
    expect(getAvailableOrderActions('shipped')).toEqual(['deliver'])
  })
})
