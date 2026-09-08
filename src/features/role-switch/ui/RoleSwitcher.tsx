import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import { setDemoRole } from '@/app/store'
import { ROLE_DEFINITIONS, type RoleId } from '@/entities/role'
import { Select } from '@/shared/ui'

export function RoleSwitcher() {
  const dispatch = useDispatch<AppDispatch>()
  const role = useSelector((state: RootState) => state.demoRole.role)

  return (
    <div className="flex min-w-[9.5rem] items-center gap-2">
      <span className="hidden text-caption text-text-secondary md:inline">
        Role
      </span>
      <Select
        ariaLabel="Demo role"
        value={role}
        options={ROLE_DEFINITIONS.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        onChange={(value) => dispatch(setDemoRole(value as RoleId))}
        className="min-w-[8.5rem]"
      />
    </div>
  )
}
