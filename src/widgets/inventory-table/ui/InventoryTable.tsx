import type { InventoryListItem } from '@/entities/inventory'
import { useCan } from '@/features/role-switch'
import {
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableEmpty,
} from '@/shared/ui'

type InventoryTableProps = {
  items: InventoryListItem[]
  emptyMessage: string
  onSort: (field: string) => void
  sort?: string
  onAdjust: (item: InventoryListItem) => void
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

function stockLabel(status: InventoryListItem['stockStatus']) {
  if (status === 'in_stock') return 'In stock'
  if (status === 'low_stock') return 'Low stock'
  return 'Out of stock'
}

export function InventoryTable({
  items,
  emptyMessage,
  onSort,
  sort,
  onAdjust,
}: InventoryTableProps) {
  const canAdjust = useCan('inventory.write')
  return (
    <DataTable>
      <THead>
        <TR>
          <TH>
            <SortButton
              label="Product"
              field="productName"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton label="SKU" field="sku" sort={sort} onSort={onSort} />
          </TH>
          <TH>Warehouse</TH>
          <TH>
            <SortButton
              label="Available"
              field="available"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Reserved</TH>
          <TH>Incoming</TH>
          <TH>Stock</TH>
          <TH>
            <SortButton
              label="Updated"
              field="updatedAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Actions</TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={9}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD className="font-medium">{item.productName}</TD>
              <TD className="text-small text-text-secondary">{item.sku}</TD>
              <TD>{item.warehouseName}</TD>
              <TD>{item.available}</TD>
              <TD>{item.reserved}</TD>
              <TD>{item.incoming}</TD>
              <TD>
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption">
                  {stockLabel(item.stockStatus)}
                </span>
              </TD>
              <TD className="text-small text-text-secondary">
                {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
              </TD>
              <TD>
                {canAdjust ? (
                  <button
                    type="button"
                    className="text-small font-medium text-accent hover:underline"
                    onClick={() => onAdjust(item)}
                  >
                    Adjust
                  </button>
                ) : (
                  <span className="text-caption text-text-secondary">—</span>
                )}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
