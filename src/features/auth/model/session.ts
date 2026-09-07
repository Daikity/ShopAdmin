import {
  clearAuth,
  getAuthToken,
  getSessionUser,
  isAuthenticated as readIsAuthenticated,
  saveAuth,
  validateCredentials,
  type SessionUser,
} from './authStorage'

/** Токен, который MSW auth probe считает просроченным. */
export const FORCE_401_TOKEN = 'force-401'

let version = 0
const listeners = new Set<() => void>()

function emit() {
  version += 1
  listeners.forEach((listener) => listener())
}

/** Подписка для useSyncExternalStore — не Redux-store. */
export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot() {
  return version
}

export function getServerSnapshot() {
  return 0
}

export function getToken() {
  return getAuthToken()
}

export function isAuthenticated() {
  return readIsAuthenticated()
}

export function getSession(): SessionUser | null {
  return getSessionUser()
}

export function login() {
  saveAuth()
  emit()
}

export function logout() {
  clearAuth()
  emit()
}

export { validateCredentials }
