import { useTranslation } from 'react-i18next'
import type { ReturnListItem } from '@/entities/return'
import { formatDate, formatMoney } from '@/shared/lib'
import {
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableEmpty,
} from '@/shared/ui'

type ReturnTableProps = {
  items: ReturnListItem[]
  emptyMessage: string
  onSort: (field: string) => void
  sort?: string
  onOpen: (item: ReturnListItem) => void
}

function SortButton({
  label,
  field,
  sort,
  onSort,
}: {
  label: string
  field: string
  sort?: string
  onSort: (field: string) => void
}) {
  const active = sort?.startsWith(`${field}:`)
  const order = sort?.endsWith(':asc') ? 'asc' : 'desc'
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 hover:text-text-primary"
      onClick={() => onSort(field)}
    >
      {label}
      {active ? <span aria-hidden>{order === 'asc' ? '↑' : '↓'}</span> : null}
    </button>
  )
}

export function ReturnTable({
  items,
  emptyMessage,
  onSort,
  sort,
  onOpen,
}: ReturnTableProps) {
  const { t } = useTranslation()

  return (
    <DataTable>
      <THead>
        <TR>
          <TH>
            <SortButton
              label={t('returns.table.return')}
              field="number"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('returns.table.order')}</TH>
          <TH>{t('returns.table.customer')}</TH>
          <TH>{t('returns.table.product')}</TH>
          <TH>{t('returns.table.reason')}</TH>
          <TH>
            <SortButton
              label={t('returns.table.amount')}
              field="amount"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('returns.table.status')}
              field="status"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('returns.table.created')}
              field="createdAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={8}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD label={t('returns.table.return')}>
                <button
                  type="button"
                  className="font-medium text-accent hover:underline"
                  onClick={() => onOpen(item)}
                >
                  {item.number}
                </button>
              </TD>
              <TD label={t('returns.table.order')} className="text-small">
                {item.orderNumber}
              </TD>
              <TD label={t('returns.table.customer')}>{item.customerName}</TD>
              <TD label={t('returns.table.product')}>{item.productName}</TD>
              <TD
                label={t('returns.table.reason')}
                className="text-small text-text-secondary"
              >
                {item.reason}
              </TD>
              <TD label={t('returns.table.amount')}>
                {formatMoney(item.amount)}
              </TD>
              <TD label={t('returns.table.status')}>
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption">
                  {t(`enums.returnStatus.${item.status}`)}
                </span>
              </TD>
              <TD
                label={t('returns.table.created')}
                className="text-small text-text-secondary"
              >
                {formatDate(item.createdAt)}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
