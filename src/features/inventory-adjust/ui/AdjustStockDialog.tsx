import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import type {
  AdjustStockFormValues,
  InventoryListItem,
} from '@/entities/inventory'
import { createAdjustStockSchema } from '@/entities/inventory'
import { notifyToast } from '@/shared/lib'
import { useAdjustStockMutation } from '@/shared/api/inventoryApi'
import { ConfirmDialog } from '@/shared/ui'

type AdjustStockDialogProps = {
  item: InventoryListItem | null
  onClose: () => void
}

export function AdjustStockDialog({ item, onClose }: AdjustStockDialogProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createAdjustStockSchema(t), [t])
  const [adjustStock, { isLoading }] = useAdjustStockMutation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const form = useForm<AdjustStockFormValues>({
    resolver: zodResolver(schema),
    values: { adjustment: -1, reason: '' },
  })
  const adjustment = useWatch({ control: form.control, name: 'adjustment' })

  if (!item) return null

  const nextAvailable = Math.max(0, item.available + (Number(adjustment) || 0))

  async function submit(values: AdjustStockFormValues) {
    try {
      await adjustStock({
        id: item!.id,
        adjustment: values.adjustment,
        reason: values.reason,
      }).unwrap()
      notifyToast({
        tone: 'success',
        message: t('inventory.toast.success', { sku: item!.sku }),
      })
      setConfirmOpen(false)
      onClose()
    } catch {
      notifyToast({
        tone: 'error',
        message: t('inventory.toast.failed', { sku: item!.sku }),
      })
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adjust-stock-title"
      >
        <div className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-overlay">
          <h2 id="adjust-stock-title" className="text-h2">
            {t('inventory.adjustTitle')}
          </h2>
          <p className="mt-1 text-small text-text-secondary">
            {item.productName} · {item.warehouseName}
          </p>
          <p className="mt-3 text-small">
            {t('inventory.adjustCurrentNext', {
              current: item.available,
              next: nextAvailable,
            })}
          </p>

          <form
            className="mt-4 space-y-3"
            onSubmit={form.handleSubmit(() => setConfirmOpen(true))}
          >
            <label className="block text-small">
              {t('inventory.adjustmentLabel')}
              <input
                type="number"
                className="mt-1 h-10 w-full rounded-md border border-border px-3"
                {...form.register('adjustment', { valueAsNumber: true })}
              />
              {form.formState.errors.adjustment ? (
                <span className="mt-1 block text-caption text-danger">
                  {form.formState.errors.adjustment.message}
                </span>
              ) : null}
            </label>
            <label className="block text-small">
              {t('inventory.reasonLabel')}
              <input
                className="mt-1 h-10 w-full rounded-md border border-border px-3"
                placeholder={t('inventory.reasonPlaceholder')}
                {...form.register('reason')}
              />
              {form.formState.errors.reason ? (
                <span className="mt-1 block text-caption text-danger">
                  {form.formState.errors.reason.message}
                </span>
              ) : null}
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2 text-small"
                onClick={onClose}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground"
              >
                {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('inventory.confirmTitle')}
        description={t('inventory.confirmDescription', {
          sku: item.sku,
          from: item.available,
          to: nextAvailable,
        })}
        isPending={isLoading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void form.handleSubmit(submit)()}
      />
    </>
  )
}
