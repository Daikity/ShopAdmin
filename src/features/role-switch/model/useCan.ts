import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'
import { can, type Permission } from '@/entities/role'

export function useDemoRole() {
  return useSelector((state: RootState) => state.demoRole.role)
}

/** UI capability: true если текущая demo-роль имеет permission. */
export function useCan(permission: Permission) {
  const role = useDemoRole()
  return can(role, permission)
}
