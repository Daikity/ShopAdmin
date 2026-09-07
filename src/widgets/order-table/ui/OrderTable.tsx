import { Link } from 'react-router-dom'
import type { OrderListItem } from '@/entities/order'
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
    <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption capitalize">
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
              aria-label="Выбрать все на странице"
            />
          </TH>
          <TH>
            <SortButton
              label="Order"
              field="number"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Customer</TH>
          <TH>
            <SortButton
              label="Date"
              field="createdAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Items</TH>
          <TH>
            <SortButton
              label="Total"
              field="total"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Payment</TH>
          <TH>Fulfillment</TH>
          <TH>
            <SortButton
              label="Status"
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
                  aria-label={`Выбрать ${item.number}`}
                />
              </TD>
              <TD>
                <Link
                  to={`/orders/${item.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {item.number}
                </Link>
              </TD>
              <TD>
                <div className="font-medium">{item.customerName}</div>
                <div className="text-caption text-text-secondary">
                  {item.customerEmail}
                </div>
              </TD>
              <TD className="text-small text-text-secondary">
                {new Date(item.createdAt).toLocaleDateString('ru-RU')}
              </TD>
              <TD>{item.itemsCount}</TD>
              <TD>€{item.total.toFixed(2)}</TD>
              <TD>
                <StatusBadge value={item.paymentStatus} />
              </TD>
              <TD>
                <StatusBadge value={item.fulfillmentStatus} />
              </TD>
              <TD>
                <StatusBadge value={item.status} />
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
