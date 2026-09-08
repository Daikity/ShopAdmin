import type { User } from '@/entities/user'
import { getRoleDefinition } from '@/entities/role'
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
  return (
    <DataTable>
      <THead>
        <TR>
          <TH>Name</TH>
          <TH>Email</TH>
          <TH>Role</TH>
          <TH>Status</TH>
          <TH>Last login</TH>
          <TH>Created</TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={6}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((user) => (
            <TR key={user.id}>
              <TD className="font-medium">{user.name}</TD>
              <TD className="text-text-secondary">{user.email}</TD>
              <TD>{getRoleDefinition(user.role).name}</TD>
              <TD>{user.status}</TD>
              <TD className="text-text-secondary">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString('en-GB')
                  : '—'}
              </TD>
              <TD className="text-text-secondary">
                {new Date(user.createdAt).toLocaleDateString('en-GB')}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
