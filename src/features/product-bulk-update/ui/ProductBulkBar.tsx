import { useMemo, useState } from 'react'
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
    () => `${selectedIds.length} selected`,
    [selectedIds.length],
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
          message: `${response.updated} products updated`,
        })
      } else if (response.updated > 0) {
        notifyToast({
          tone: 'warning',
          message: `${response.updated} updated, ${response.failed} failed`,
        })
      } else {
        notifyToast({
          tone: 'error',
          message: `Bulk failed for ${response.failed} products`,
        })
      }
    } catch {
      notifyToast({ tone: 'error', message: 'Bulk operation failed' })
      setPanel(null)
    }
  }

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
        <p className="mr-2 text-small font-medium text-text-primary">{countLabel}</p>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('status')}
        >
          Change status
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('category')}
        >
          Change category
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('price')}
        >
          Update price
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => setPanel('stock')}
        >
          Update stock
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-small"
          onClick={() => void run({ type: 'export' })}
          disabled={isLoading}
        >
          Export
        </button>
        <button
          type="button"
          className="rounded-md border border-danger/40 bg-surface px-2.5 py-1.5 text-small text-danger"
          onClick={() => setPanel('delete')}
        >
          Delete
        </button>
        <button
          type="button"
          className="ml-auto rounded-md px-2.5 py-1.5 text-small text-text-secondary underline"
          onClick={onClearSelection}
        >
          Clear
        </button>
      </div>

      {panel === 'status' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-44 flex-1">
            <p className="mb-1 text-small">Status</p>
            <Select
              ariaLabel="Bulk status"
              value={status}
              options={[
                { value: 'active', label: 'active' },
                { value: 'draft', label: 'draft' },
                { value: 'archived', label: 'archived' },
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
            Apply
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {panel === 'category' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-44 flex-1">
            <p className="mb-1 text-small">Category</p>
            <Select
              ariaLabel="Bulk category"
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
            Apply
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {panel === 'price' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-40">
            <p className="mb-1 text-small">Mode</p>
            <Select
              ariaLabel="Price mode"
              value={priceMode}
              options={[
                { value: 'percent', label: 'percent' },
                { value: 'fixed', label: 'fixed €' },
              ]}
              onChange={(value) => setPriceMode(value as typeof priceMode)}
            />
          </div>
          <label className="flex flex-col gap-1 text-small">
            Value
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
            Apply
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {panel === 'stock' ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
          <div className="min-w-40">
            <p className="mb-1 text-small">Mode</p>
            <Select
              ariaLabel="Stock mode"
              value={stockMode}
              options={[
                { value: 'adjust', label: 'adjust' },
                { value: 'set', label: 'set' },
              ]}
              onChange={(value) => setStockMode(value as typeof stockMode)}
            />
          </div>
          <label className="flex flex-col gap-1 text-small">
            Value
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
            Apply
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={() => setPanel(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={panel === 'delete'}
        title="Delete products"
        description={
          <p>
            Удалить {selectedIds.length} выбранных товаров? Действие необратимо.
          </p>
        }
        confirmLabel="Delete"
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
