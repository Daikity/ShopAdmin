import { Link } from 'react-router-dom'
import type { ProductListItem } from '@/entities/product'
import {
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableEmpty,
} from '@/shared/ui'

type ProductTableProps = {
  items: ProductListItem[]
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

export function ProductTable({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  emptyMessage,
  onSort,
  sort,
}: ProductTableProps) {
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
          <TH>Товар</TH>
          <TH>
            <SortButton label="SKU" field="sku" sort={sort} onSort={onSort} />
          </TH>
          <TH>Категория</TH>
          <TH>Variants</TH>
          <TH>
            <SortButton label="Цена" field="price" sort={sort} onSort={onSort} />
          </TH>
          <TH>
            <SortButton label="Stock" field="stock" sort={sort} onSort={onSort} />
          </TH>
          <TH>Status</TH>
          <TH>
            <SortButton
              label="Updated"
              field="updatedAt"
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
                  aria-label={`Выбрать ${item.name}`}
                />
              </TD>
              <TD>
                <Link
                  to={`/catalog/products/${item.id}`}
                  className="flex items-center gap-3 font-medium text-accent hover:underline"
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <span>{item.name}</span>
                </Link>
              </TD>
              <TD className="text-small text-text-secondary">{item.sku}</TD>
              <TD>{item.categoryName}</TD>
              <TD>{item.variantsCount}</TD>
              <TD>€{item.price.toFixed(2)}</TD>
              <TD>{item.stock}</TD>
              <TD>
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption capitalize">
                  {item.status}
                </span>
              </TD>
              <TD className="text-small text-text-secondary">
                {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
