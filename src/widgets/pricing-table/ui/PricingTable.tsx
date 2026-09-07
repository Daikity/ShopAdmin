import type { PriceListItem } from '@/entities/pricing'
import {
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableEmpty,
} from '@/shared/ui'

type PricingTableProps = {
  items: PriceListItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onToggleAll: (ids: string[]) => void
  emptyMessage: string
  onSort: (field: string) => void
  sort?: string
  onEdit: (item: PriceListItem) => void
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

export function PricingTable({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  emptyMessage,
  onSort,
  sort,
  onEdit,
}: PricingTableProps) {
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
              label="Product"
              field="productName"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton label="SKU" field="sku" sort={sort} onSort={onSort} />
          </TH>
          <TH>
            <SortButton
              label="Price"
              field="price"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Compare-at</TH>
          <TH>
            <SortButton
              label="Margin"
              field="margin"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>Discount</TH>
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
              <TD>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                  aria-label={`Выбрать ${item.productName}`}
                />
              </TD>
              <TD className="font-medium">{item.productName}</TD>
              <TD className="text-small text-text-secondary">{item.sku}</TD>
              <TD>€{item.price.toFixed(2)}</TD>
              <TD>
                {item.compareAtPrice !== null
                  ? `€${item.compareAtPrice.toFixed(2)}`
                  : '—'}
              </TD>
              <TD>{item.margin.toFixed(1)}%</TD>
              <TD>{item.discount.toFixed(1)}%</TD>
              <TD className="text-small text-text-secondary">
                {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
              </TD>
              <TD>
                <button
                  type="button"
                  className="text-small font-medium text-accent hover:underline"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
