import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BulkAction, BulkProductsResult, Category } from '@/entities/product'
import { notifyToast } from '@/shared/lib'
import { useBulkProductsMutation } from '@/shared/api/productsApi'
import { ConfirmDialog, Select } from '@/shared/ui'
import { BulkResultSummary } from './BulkResultSummary'

type ProductBulkBarProps = {
  selectedIds: string[]
  categories: Category[]
  onClearSelection: () => void
}

type Panel =
  | null
  | 'status'
  | 'category'
  | 'price'
  | 'stock'
  | 'delete'

function downloadCsv(csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `products-export-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function ProductBulkBar({
  selectedIds,
  categories,
  onClearSelection,
}: ProductBulkBarProps) {
  const { t } = useTranslation()
  const [panel, setPanel] = useState<Panel>(null)
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [priceMode, setPriceMode] = useState<'percent' | 'fixed'>('percent')
  const [priceValue, setPriceValue] = useState(10)
  const [stockMode, setStockMode] = useState<'set' | 'adjust'>('adjust')
  const [stockValue, setStockValue] = useState(0)
  const [result, setResult] = useState<BulkProductsResult | null>(null)
  const [bulkProducts, { isLoading }] = useBulkProductsMutation()

  const countLabel = useMemo(
    () => t('bulk.selected', { count: selectedIds.length }),
    [selectedIds.length, t],
  )

  if (selectedIds.length === 0) {
    return null
  }

  async function run(action: BulkAction) {
    try {
      const response = await bulkProducts({ ids: selectedIds, action }).unwrap()
      setResult(response)
      setPanel(null)

      if (action.type === 'export' && response.exportCsv) {
        downloadCsv(response.exportCsv)
      }

      if (action.type === 'delete' && response.updated > 0) {
        onClearSelection()
      }

      if (response.failed === 0) {
        notifyToast({
          tone: 'success',
          message: t('bulk.toast.allOk', { updated: response.updated }),
        })
      } else if (response.updated > 0) {
        notifyToast({
          tone: 'warning',
          message: t('bulk.toast.partial', {
            updated: response.updated,
            failed: response.failed,
          }),
        })
      } else {
        notifyToast({
          tone: 'error',
          message: t('bulk.toast.allFailed', { failed: response.failed }),
        })
      }
    } catch {
      notifyToast({ tone: 'error', message: t('bulk.toast.error') })
      setPanel(null)
    }
  }

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
        <p
          className="mr-2 text-small font-medium text-text-primary"
          aria-live="polite"
        >
          {countLabel}
        </p>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('status')}
        >
          {t('bulk.changeStatus')}
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('category')}
        >
          {t('bulk.changeCategory')}
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('price')}
        >
          {t('bulk.updatePrice')}
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('stock')}
        >
          {t('bulk.updateStock')}
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => void run({ type: 'export' })}
          disabled={isLoading}
        >
          {t('bulk.export')}
        </button>
        <button
          type="button"
          className="rounded-md border border-danger/40 bg-surface px-2.5 py-1.5 text-small text-danger"
          onClick={() => setPanel('delete')}
        >
          {t('bulk.delete')}
        </button>
        <button
          type="button"
          className="ml-auto rounded-md px-2.5 py-1.5 text-small text-text-secondary underline"
          onClick={onClearSelection}
        >
          {t('bulk.clear')}
        </button>
      </div>

      {panel === 'status' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-44 flex-1">
            <p className="mb-1 text-small">{t('bulk.statusLabel')}</p>
            <Select
              ariaLabel={t('bulk.statusAria')}
              value={status}
              options={[
                { value: 'active', label: t('enums.productStatus.active') },
                { value: 'draft', label: t('enums.productStatus.draft') },
                { value: 'archived', label: t('enums.productStatus.archived') },
              ]}
              onChange={(value) => setStatus(value as typeof status)}
            />
          </div>
          <button
            type="button"
            className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground"
            disabled={isLoading}
            onClick={() => void run({ type: 'changeStatus', status })}
          >
            {t('bulk.apply')}
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            {t('bulk.cancel')}
          </button>
        </div>
      ) : null}

      {panel === 'category' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-44 flex-1">
            <p className="mb-1 text-small">{t('bulk.categoryLabel')}</p>
            <Select
              ariaLabel={t('bulk.categoryAria')}
              value={categoryId}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              onChange={setCategoryId}
            />
          </div>
          <button
            type="button"
            className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground"
            disabled={isLoading || !categoryId}
            onClick={() => void run({ type: 'changeCategory', categoryId })}
          >
            {t('bulk.apply')}
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            {t('bulk.cancel')}
          </button>
        </div>
      ) : null}

      {panel === 'price' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-40">
            <p className="mb-1 text-small">{t('bulk.modeLabel')}</p>
            <Select
              ariaLabel={t('bulk.priceModeAria')}
              value={priceMode}
              options={[
                { value: 'percent', label: t('bulk.mode.percent') },
                { value: 'fixed', label: t('bulk.mode.fixed') },
              ]}
              onChange={(value) => setPriceMode(value as typeof priceMode)}
            />
          </div>
          <label className="flex flex-col gap-1 text-small">
            {t('bulk.valueLabel')}
            <input
              type="number"
              className="h-10 w-28 rounded-md border border-border px-2"
              value={priceValue}
              onChange={(event) => setPriceValue(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground"
            disabled={isLoading}
            onClick={() =>
              void run({
                type: 'updatePrice',
                mode: priceMode,
                value: priceValue,
              })
            }
          >
            {t('bulk.apply')}
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            {t('bulk.cancel')}
          </button>
        </div>
      ) : null}

      {panel === 'stock' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-40">
            <p className="mb-1 text-small">{t('bulk.modeLabel')}</p>
            <Select
              ariaLabel={t('bulk.stockModeAria')}
              value={stockMode}
              options={[
                { value: 'adjust', label: t('bulk.mode.adjust') },
                { value: 'set', label: t('bulk.mode.set') },
              ]}
              onChange={(value) => setStockMode(value as typeof stockMode)}
            />
          </div>
          <label className="flex flex-col gap-1 text-small">
            {t('bulk.valueLabel')}
            <input
              type="number"
              className="h-10 w-28 rounded-md border border-border px-2"
              value={stockValue}
              onChange={(event) => setStockValue(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground"
            disabled={isLoading}
            onClick={() =>
              void run({
                type: 'updateStock',
                mode: stockMode,
                value: stockValue,
              })
            }
          >
            {t('bulk.apply')}
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            {t('bulk.cancel')}
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={panel === 'delete'}
        title={t('bulk.deleteTitle')}
        description={
          <p>
            {t('bulk.deleteDescription', { count: selectedIds.length })}
          </p>
        }
        confirmLabel={t('bulk.deleteConfirm')}
        tone="danger"
        isPending={isLoading}
        onCancel={() => setPanel(null)}
        onConfirm={() => void run({ type: 'delete' })}
      />

      {result ? (
        <BulkResultSummary result={result} onDismiss={() => setResult(null)} />
      ) : null}
    </div>
  )
}
