import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import { setDemoRole } from '@/app/store'
import { ROLE_DEFINITIONS, type RoleId } from '@/entities/role'
import { Select } from '@/shared/ui'

export function RoleSwitcher() {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const role = useSelector((state: RootState) => state.demoRole.role)

  return (
    <div className="flex min-w-[9.5rem] items-center gap-2">
      <span className="hidden text-caption text-text-secondary md:inline">
        {t('roleSwitch.label')}
      </span>
      <Select
        ariaLabel={t('roleSwitch.aria')}
        value={role}
        options={ROLE_DEFINITIONS.map((item) => ({
          value: item.id,
          label: t(`enums.demoRole.${item.id}`),
        }))}
        onChange={(value) => dispatch(setDemoRole(value as RoleId))}
        className="min-w-[8.5rem]"
      />
    </div>
  )
}
