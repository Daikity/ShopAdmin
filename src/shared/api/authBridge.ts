type TokenGetter = () => string | null
type UnauthorizedHandler = () => void

let getTokenImpl: TokenGetter = () => null
let onUnauthorizedImpl: UnauthorizedHandler = () => {}

/** Связка shared/api ↔ features/auth без прямого импорта features из shared. */
export function setAuthTokenGetter(getter: TokenGetter) {
  getTokenImpl = getter
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorizedImpl = handler
}

export function readAuthToken() {
  return getTokenImpl()
}

export function notifyUnauthorized() {
  onUnauthorizedImpl()
}
