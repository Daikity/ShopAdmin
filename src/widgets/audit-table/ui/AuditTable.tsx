import type { AuditLogItem } from '@/entities/audit'
import {
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableEmpty,
} from '@/shared/ui'

type AuditTableProps = {
  items: AuditLogItem[]
  emptyMessage: string
}

export function AuditTable({ items, emptyMessage }: AuditTableProps) {
  return (
    <DataTable>
      <THead>
        <TR>
          <TH>Date</TH>
          <TH>User</TH>
          <TH>Action</TH>
          <TH>Entity</TH>
          <TH>Entity ID</TH>
          <TH>Changes</TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={6}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD className="whitespace-nowrap text-text-secondary">
                {new Date(item.at).toLocaleString('en-GB')}
              </TD>
              <TD className="font-medium">{item.user}</TD>
              <TD>{item.action}</TD>
              <TD>{item.entity}</TD>
              <TD className="font-mono text-caption">{item.entityId}</TD>
              <TD className="max-w-xs truncate text-text-secondary">
                {item.changes}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
