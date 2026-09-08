import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ProductListItem } from '@/entities/product'
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
          <TH>{t('products.table.product')}</TH>
          <TH>
            <SortButton
              label={t('products.table.sku')}
              field="sku"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('products.table.category')}</TH>
          <TH>{t('products.table.variants')}</TH>
          <TH>
            <SortButton
              label={t('products.table.price')}
              field="price"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('products.table.stock')}
              field="stock"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('products.table.status')}</TH>
          <TH>
            <SortButton
              label={t('products.table.updated')}
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
                  aria-label={t('common.selectItem', { name: item.name })}
                />
              </TD>
              <TD label={t('products.table.product')}>
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
              <TD
                label={t('products.table.sku')}
                className="text-small text-text-secondary"
              >
                {item.sku}
              </TD>
              <TD label={t('products.table.category')}>{item.categoryName}</TD>
              <TD label={t('products.table.variants')}>{item.variantsCount}</TD>
              <TD label={t('products.table.price')}>
                {formatMoney(item.price)}
              </TD>
              <TD label={t('products.table.stock')}>{item.stock}</TD>
              <TD label={t('products.table.status')}>
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption">
                  {t(`enums.productStatus.${item.status}`)}
                </span>
              </TD>
              <TD
                label={t('products.table.updated')}
                className="text-small text-text-secondary"
              >
                {formatDate(item.updatedAt)}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
