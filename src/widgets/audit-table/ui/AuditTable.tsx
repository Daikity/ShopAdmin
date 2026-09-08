import { useTranslation } from 'react-i18next'
import type { AuditLogItem } from '@/entities/audit'
import { formatDateTime } from '@/shared/lib'
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
  const { t } = useTranslation()

  return (
    <DataTable>
      <THead>
        <TR>
          <TH>{t('audit.table.date')}</TH>
          <TH>{t('audit.table.user')}</TH>
          <TH>{t('audit.table.action')}</TH>
          <TH>{t('audit.table.entity')}</TH>
          <TH>{t('audit.table.entityId')}</TH>
          <TH>{t('audit.table.changes')}</TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={6}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD
                label={t('audit.table.date')}
                className="whitespace-nowrap text-text-secondary"
              >
                {formatDateTime(item.at)}
              </TD>
              <TD label={t('audit.table.user')} className="font-medium">
                {item.user}
              </TD>
              <TD label={t('audit.table.action')}>{item.action}</TD>
              <TD label={t('audit.table.entity')}>{item.entity}</TD>
              <TD
                label={t('audit.table.entityId')}
                className="font-mono text-caption"
              >
                {item.entityId}
              </TD>
              <TD
                label={t('audit.table.changes')}
                className="max-w-xs truncate text-text-secondary"
              >
                {item.changes}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
