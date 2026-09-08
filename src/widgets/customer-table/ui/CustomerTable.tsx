import { Link } from 'react-router-dom'
import type { CustomerListItem } from '@/entities/customer'
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
  return (
    <DataTable>
      <THead>
        <TR>
          <TH>
            <SortButton label="Customer" field="name" sort={sort} onSort={onSort} />
          </TH>
          <TH>Email</TH>
          <TH>
            <SortButton
              label="Orders"
              field="ordersCount"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label="Total spent"
              field="totalSpent"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label="Last order"
              field="lastOrderAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Status</TH>
          <TH>
            <SortButton
              label="Created"
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
              <TD>
                <Link
                  to={`/customers/${item.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {item.name}
                </Link>
              </TD>
              <TD className="text-small text-text-secondary">{item.email}</TD>
              <TD>{item.ordersCount}</TD>
              <TD>€{item.totalSpent.toFixed(2)}</TD>
              <TD className="text-small text-text-secondary">
                {item.lastOrderAt
                  ? new Date(item.lastOrderAt).toLocaleDateString('ru-RU')
                  : '—'}
              </TD>
              <TD>
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption capitalize">
                  {item.status}
                </span>
              </TD>
              <TD className="text-small text-text-secondary">
                {new Date(item.createdAt).toLocaleDateString('ru-RU')}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
