import { useTranslation } from 'react-i18next'
import type { PriceListItem } from '@/entities/pricing'
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
              label={t('pricing.table.product')}
              field="productName"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('pricing.table.sku')}
              field="sku"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('pricing.table.price')}
              field="price"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('pricing.table.compareAt')}</TH>
          <TH>
            <SortButton
              label={t('pricing.table.margin')}
              field="margin"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('pricing.table.discount')}</TH>
          <TH>
            <SortButton
              label={t('pricing.table.updated')}
              field="updatedAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('pricing.table.actions')}</TH>
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
                  aria-label={t('common.selectItem', { name: item.productName })}
                />
              </TD>
              <TD label={t('pricing.table.product')} className="font-medium">
                {item.productName}
              </TD>
              <TD
                label={t('pricing.table.sku')}
                className="text-small text-text-secondary"
              >
                {item.sku}
              </TD>
              <TD label={t('pricing.table.price')}>
                {formatMoney(item.price)}
              </TD>
              <TD label={t('pricing.table.compareAt')}>
                {item.compareAtPrice !== null
                  ? formatMoney(item.compareAtPrice)
                  : '—'}
              </TD>
              <TD label={t('pricing.table.margin')}>
                {item.margin.toFixed(1)}%
              </TD>
              <TD label={t('pricing.table.discount')}>
                {item.discount.toFixed(1)}%
              </TD>
              <TD
                label={t('pricing.table.updated')}
                className="text-small text-text-secondary"
              >
                {formatDate(item.updatedAt)}
              </TD>
              <TD label={t('pricing.table.actions')}>
                <button
                  type="button"
                  className="text-small font-medium text-accent hover:underline"
                  onClick={() => onEdit(item)}
                >
                  {t('pricing.edit')}
                </button>
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  )
}
