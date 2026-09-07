import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getSnapshot,
  isAuthenticated,
  login,
  logout,
  subscribe,
} from './session'

describe('session', () => {
  beforeEach(() => {
    localStorage.clear()
    logout()
  })

  it('login и logout меняют auth и snapshot', () => {
    const before = getSnapshot()
    expect(isAuthenticated()).toBe(false)

    login()
    expect(isAuthenticated()).toBe(true)
    expect(getSnapshot()).toBeGreaterThan(before)

    const afterLogin = getSnapshot()
    logout()
    expect(isAuthenticated()).toBe(false)
    expect(getSnapshot()).toBeGreaterThan(afterLogin)
  })

  it('уведомляет subscribers', () => {
    const listener = vi.fn()
    const unsubscribe = subscribe(listener)

    login()
    expect(listener).toHaveBeenCalled()

    unsubscribe()
    listener.mockClear()
    logout()
    expect(listener).not.toHaveBeenCalled()
  })
})
