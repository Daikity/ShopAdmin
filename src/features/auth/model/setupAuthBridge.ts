import { setAuthTokenGetter, setUnauthorizedHandler } from '@/shared/api'
import { getToken, logout } from './session'

/** Связывает session facade с API layer (Bearer + 401 → logout). */
export function setupAuthBridge() {
  setAuthTokenGetter(getToken)
  setUnauthorizedHandler(logout)
}
