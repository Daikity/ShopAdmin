import type { ReturnListItem } from '@/entities/return'
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
  return (
    <DataTable>
      <THead>
        <TR>
          <TH>
            <SortButton
              label="Return"
              field="number"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Order</TH>
          <TH>Customer</TH>
          <TH>Product</TH>
          <TH>Reason</TH>
          <TH>
            <SortButton
              label="Amount"
              field="amount"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label="Status"
              field="status"
              sort={sort}
              onSort={onSort}
            />
          </TH>
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
          <TableEmpty colSpan={8}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD>
                <button
                  type="button"
                  className="font-medium text-accent hover:underline"
                  onClick={() => onOpen(item)}
                >
                  {item.number}
                </button>
              </TD>
              <TD className="text-small">{item.orderNumber}</TD>
              <TD>{item.customerName}</TD>
              <TD>{item.productName}</TD>
              <TD className="text-small text-text-secondary">{item.reason}</TD>
              <TD>€{item.amount.toFixed(2)}</TD>
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
