import { describe, expect, it } from 'vitest'
import {
  canChangeReturnStatus,
  getAvailableReturnActions,
  getAllowedNextReturnStatuses,
} from './workflow'

describe('return workflow', () => {
  it('разрешает approve/reject из requested', () => {
    expect(canChangeReturnStatus('requested', 'approved')).toBe(true)
    expect(canChangeReturnStatus('requested', 'rejected')).toBe(true)
    expect(canChangeReturnStatus('requested', 'refunded')).toBe(false)
  })

  it('блокирует выход из terminal', () => {
    expect(getAllowedNextReturnStatuses('rejected')).toEqual([])
    expect(getAllowedNextReturnStatuses('refunded')).toEqual([])
  })

  it('возвращает доступные actions', () => {
    expect(getAvailableReturnActions('approved')).toEqual(['receive'])
    expect(getAvailableReturnActions('received')).toEqual(['refund'])
  })
})
