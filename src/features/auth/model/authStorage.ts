/** Пользователь сессии (демо auth, без entity-слоя). */
export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
}

const TOKEN_KEY = 'shopadmin_auth_token'
const USER_KEY = 'shopadmin_auth_user'

export const DEMO_CREDENTIALS = {
  login: 'admin',
  password: 'admin',
} as const

export const DEMO_USER: SessionUser = {
  id: 'user-1',
  name: 'Shop Admin',
  email: 'admin@shopadmin.app',
  role: 'admin',
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function saveAuth() {
  const token = `demo-${Date.now()}`
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function validateCredentials(login: string, password: string) {
  return (
    login === DEMO_CREDENTIALS.login && password === DEMO_CREDENTIALS.password
  )
}

export const AUTH_TOKEN_KEY = TOKEN_KEY
