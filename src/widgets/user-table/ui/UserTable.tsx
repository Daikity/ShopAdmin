import { useTranslation } from 'react-i18next'
import type { User } from '@/entities/user'
import { getRoleDefinition } from '@/entities/role'
import { formatDate, formatDateTime } from '@/shared/lib'
import {
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableEmpty,
} from '@/shared/ui'

type UserTableProps = {
  items: User[]
  emptyMessage: string
}

export function UserTable({ items, emptyMessage }: UserTableProps) {
  const { t } = useTranslation()

  return (
    <DataTable>
      <THead>
        <TR>
          <TH>{t('users.table.name')}</TH>
          <TH>{t('users.table.email')}</TH>
          <TH>{t('users.table.role')}</TH>
          <TH>{t('users.table.status')}</TH>
          <TH>{t('users.table.lastLogin')}</TH>
          <TH>{t('users.table.created')}</TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={6}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((user) => (
            <TR key={user.id}>
              <TD label={t('users.table.name')} className="font-medium">
                {user.name}
              </TD>
              <TD label={t('users.table.email')} className="text-text-secondary">
                {user.email}
              </TD>
              <TD label={t('users.table.role')}>
                {t(`enums.demoRole.${user.role}`, {
                  defaultValue: getRoleDefinition(user.role).name,
                })}
              </TD>
              <TD label={t('users.table.status')}>
                {t(`enums.userStatus.${user.status}`)}
              </TD>
              <TD
                label={t('users.table.lastLogin')}
                className="text-text-secondary"
              >
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—'}
              </TD>
              <TD
                label={t('users.table.created')}
                className="text-text-secondary"
              >
                {formatDate(user.createdAt)}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
