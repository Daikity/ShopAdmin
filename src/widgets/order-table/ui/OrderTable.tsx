import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { OrderListItem } from '@/entities/order'
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

type OrderTableProps = {
  items: OrderListItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onToggleAll: (ids: string[]) => void
  emptyMessage: string
  onSort: (field: string) => void
  sort?: string
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

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption">
      {value}
    </span>
  )
}

export function OrderTable({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  emptyMessage,
  onSort,
  sort,
}: OrderTableProps) {
  const { t } = useTranslation()
  const allIds = items.map((item) => item.id)
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))

  return (
    <DataTable>
      <THead>
        <TR>
          <TH className="w-10">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => onToggleAll(allIds)}
              aria-label={t('common.selectAllOnPage')}
            />
          </TH>
          <TH>
            <SortButton
              label={t('orders.table.order')}
              field="number"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('orders.table.customer')}</TH>
          <TH>
            <SortButton
              label={t('orders.table.date')}
              field="createdAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('orders.table.items')}</TH>
          <TH>
            <SortButton
              label={t('orders.table.total')}
              field="total"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('orders.table.payment')}</TH>
          <TH>{t('orders.table.fulfillment')}</TH>
          <TH>
            <SortButton
              label={t('orders.table.status')}
              field="status"
              sort={sort}
              onSort={onSort}
            />
          </TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={9}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                  aria-label={t('common.selectItem', { name: item.number })}
                />
              </TD>
              <TD label={t('orders.table.order')}>
                <Link
                  to={`/orders/${item.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {item.number}
                </Link>
              </TD>
              <TD label={t('orders.table.customer')}>
                <div className="font-medium">{item.customerName}</div>
                <div className="text-caption text-text-secondary">
                  {item.customerEmail}
                </div>
              </TD>
              <TD
                label={t('orders.table.date')}
                className="text-small text-text-secondary"
              >
                {formatDate(item.createdAt)}
              </TD>
              <TD label={t('orders.table.items')}>{item.itemsCount}</TD>
              <TD label={t('orders.table.total')}>
                {formatMoney(item.total)}
              </TD>
              <TD label={t('orders.table.payment')}>
                <StatusBadge
                  value={t(`enums.paymentStatus.${item.paymentStatus}`)}
                />
              </TD>
              <TD label={t('orders.table.fulfillment')}>
                <StatusBadge
                  value={t(`enums.fulfillmentStatus.${item.fulfillmentStatus}`)}
                />
              </TD>
              <TD label={t('orders.table.status')}>
                <StatusBadge value={t(`enums.orderStatus.${item.status}`)} />
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
