import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { CustomerListItem } from '@/entities/customer'
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

type CustomerTableProps = {
  items: CustomerListItem[]
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

export function CustomerTable({
  items,
  emptyMessage,
  onSort,
  sort,
}: CustomerTableProps) {
  const { t } = useTranslation()

  return (
    <DataTable>
      <THead>
        <TR>
          <TH>
            <SortButton
              label={t('customers.table.customer')}
              field="name"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('customers.table.email')}</TH>
          <TH>
            <SortButton
              label={t('customers.table.orders')}
              field="ordersCount"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('customers.table.totalSpent')}
              field="totalSpent"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('customers.table.lastOrder')}
              field="lastOrderAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('customers.table.status')}</TH>
          <TH>
            <SortButton
              label={t('customers.table.created')}
              field="createdAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={7}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD label={t('customers.table.customer')}>
                <Link
                  to={`/customers/${item.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {item.name}
                </Link>
              </TD>
              <TD
                label={t('customers.table.email')}
                className="text-small text-text-secondary"
              >
                {item.email}
              </TD>
              <TD label={t('customers.table.orders')}>{item.ordersCount}</TD>
              <TD label={t('customers.table.totalSpent')}>
                {formatMoney(item.totalSpent)}
              </TD>
              <TD
                label={t('customers.table.lastOrder')}
                className="text-small text-text-secondary"
              >
                {item.lastOrderAt ? formatDate(item.lastOrderAt) : '—'}
              </TD>
              <TD label={t('customers.table.status')}>
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption">
                  {t(`enums.customerStatus.${item.status}`)}
                </span>
              </TD>
              <TD
                label={t('customers.table.created')}
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
