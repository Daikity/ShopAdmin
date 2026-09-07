import { useSyncExternalStore } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  getServerSnapshot,
  getSnapshot,
  isAuthenticated,
  subscribe,
} from '../model/session'

export function ProtectedRoute() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const location = useLocation()

  if (!isAuthenticated()) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}
