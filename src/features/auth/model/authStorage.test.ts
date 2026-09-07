import { beforeEach, describe, expect, it } from 'vitest'
import {
  AUTH_TOKEN_KEY,
  DEMO_CREDENTIALS,
  DEMO_USER,
  clearAuth,
  getAuthToken,
  getSessionUser,
  isAuthenticated,
  saveAuth,
  validateCredentials,
} from './authStorage'

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('принимает demo credentials', () => {
    expect(
      validateCredentials(DEMO_CREDENTIALS.login, DEMO_CREDENTIALS.password),
    ).toBe(true)
    expect(validateCredentials('admin', 'wrong')).toBe(false)
  })

  it('сохраняет token и user без пароля', () => {
    saveAuth()

    expect(isAuthenticated()).toBe(true)
    expect(getAuthToken()).toMatch(/^demo-/)
    expect(getSessionUser()).toEqual(DEMO_USER)
    expect(localStorage.getItem('password')).toBeNull()
  })

  it('очищает сессию', () => {
    saveAuth()
    clearAuth()

    expect(isAuthenticated()).toBe(false)
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(getSessionUser()).toBeNull()
  })
})
