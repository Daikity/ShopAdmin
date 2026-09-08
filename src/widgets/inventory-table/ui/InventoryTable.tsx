import { useTranslation } from 'react-i18next'
import type { InventoryListItem } from '@/entities/inventory'
import { useCan } from '@/features/role-switch'
import { formatDate } from '@/shared/lib'
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

export function InventoryTable({
  items,
  emptyMessage,
  onSort,
  sort,
  onAdjust,
}: InventoryTableProps) {
  const { t } = useTranslation()
  const canAdjust = useCan('inventory.write')
  return (
    <DataTable>
      <THead>
        <TR>
          <TH>
            <SortButton
              label={t('inventory.table.product')}
              field="productName"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>
            <SortButton
              label={t('inventory.table.sku')}
              field="sku"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('inventory.table.warehouse')}</TH>
          <TH>
            <SortButton
              label={t('inventory.table.available')}
              field="available"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('inventory.table.reserved')}</TH>
          <TH>{t('inventory.table.incoming')}</TH>
          <TH>{t('inventory.table.stock')}</TH>
          <TH>
            <SortButton
              label={t('inventory.table.updated')}
              field="updatedAt"
              sort={sort}
              onSort={onSort}
            />
          </TH>
          <TH>{t('inventory.table.actions')}</TH>
        </TR>
      </THead>
      <TBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={9}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD label={t('inventory.table.product')} className="font-medium">
                {item.productName}
              </TD>
              <TD
                label={t('inventory.table.sku')}
                className="text-small text-text-secondary"
              >
                {item.sku}
              </TD>
              <TD label={t('inventory.table.warehouse')}>
                {item.warehouseName}
              </TD>
              <TD label={t('inventory.table.available')}>{item.available}</TD>
              <TD label={t('inventory.table.reserved')}>{item.reserved}</TD>
              <TD label={t('inventory.table.incoming')}>{item.incoming}</TD>
              <TD label={t('inventory.table.stock')}>
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-caption">
                  {t(`enums.stockStatus.${item.stockStatus}`)}
                </span>
              </TD>
              <TD
                label={t('inventory.table.updated')}
                className="text-small text-text-secondary"
              >
                {formatDate(item.updatedAt)}
              </TD>
              <TD label={t('inventory.table.actions')}>
                {canAdjust ? (
                  <button
                    type="button"
                    className="text-small font-medium text-accent hover:underline"
                    onClick={() => onAdjust(item)}
                  >
                    {t('inventory.adjust')}
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
