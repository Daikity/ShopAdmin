import { useMemo, useState } from 'react'
import type { BulkPriceMode, PriceListItem } from '@/entities/pricing'
import { buildBulkPricePreview } from '@/entities/pricing'
import { notifyToast } from '@/shared/lib'
import { useBulkUpdatePricesMutation } from '@/shared/api/pricingApi'
import { ConfirmDialog, Select } from '@/shared/ui'

type PriceBulkBarProps = {
  selectedIds: string[]
  selectedItems: PriceListItem[]
  onClearSelection: () => void
}

export function PriceBulkBar({
  selectedIds,
  selectedItems,
  onClearSelection,
}: PriceBulkBarProps) {
  const [mode, setMode] = useState<BulkPriceMode>('percent')
  const [value, setValue] = useState(7)
  const [showPreview, setShowPreview] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [bulkUpdate, { isLoading }] = useBulkUpdatePricesMutation()

  const preview = useMemo(
    () => buildBulkPricePreview(selectedItems, mode, value),
    [selectedItems, mode, value],
  )

  if (selectedIds.length === 0) return null

  async function apply() {
    try {
      const result = await bulkUpdate({
        ids: selectedIds,
        mode,
        value,
      }).unwrap()
      notifyToast({
        tone: 'success',
        message: `${result.updated} prices updated`,
      })
      setConfirmOpen(false)
      setShowPreview(false)
      onClearSelection()
    } catch {
      notifyToast({ tone: 'error', message: 'Bulk price update failed' })
      setConfirmOpen(false)
    }
  }

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-end gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
        <p className="mr-2 text-small font-medium">
          Selected: {selectedIds.length}
        </p>
        <div className="min-w-36">
          <p className="mb-1 text-caption text-text-secondary">Mode</p>
          <Select
            ariaLabel="Bulk price mode"
            value={mode}
            options={[
              { value: 'percent', label: 'Percent %' },
              { value: 'fixed', label: 'Fixed €' },
            ]}
            onChange={(next) => setMode(next as BulkPriceMode)}
          />
        </div>
        <label className="text-caption text-text-secondary">
          Value
          <input
            type="number"
            className="mt-1 h-10 w-28 rounded-md border border-border bg-surface px-3 text-small text-text-primary"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-3 py-2 text-small"
          onClick={() => setShowPreview(true)}
          disabled={value === 0}
        >
          Preview
        </button>
        <button
          type="button"
          className="ml-auto rounded-md px-2.5 py-1.5 text-small text-text-secondary underline"
          onClick={onClearSelection}
        >
          Clear
        </button>
      </div>

      {showPreview ? (
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-small font-medium">
            Old total: €{preview.oldTotal.toFixed(2)} → New total: €
            {preview.newTotal.toFixed(2)}
          </p>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-small text-text-secondary">
            {preview.items.slice(0, 8).map((item) => (
              <li key={item.id}>
                {item.sku}: €{item.oldPrice.toFixed(2)} → €
                {item.newPrice.toFixed(2)}
              </li>
            ))}
            {preview.items.length > 8 ? (
              <li>…и ещё {preview.items.length - 8}</li>
            ) : null}
          </ul>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground"
              onClick={() => setConfirmOpen(true)}
            >
              Apply
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-2 text-small"
              onClick={() => setShowPreview(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title="Применить bulk pricing?"
        description={`Обновить цены у ${preview.count} товаров. Новый total €${preview.newTotal.toFixed(2)}.`}
        isPending={isLoading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void apply()}
      />
    </div>
  )
}
