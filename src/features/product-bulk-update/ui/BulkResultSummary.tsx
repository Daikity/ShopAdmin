import type { BulkProductsResult } from '@/entities/product'
import { resolveBulkStatus } from '@/entities/product'

type BulkResultSummaryProps = {
  result: BulkProductsResult
  onDismiss: () => void
}

export function BulkResultSummary({ result, onDismiss }: BulkResultSummaryProps) {
  const status = resolveBulkStatus(result)
  const toneClass =
    status === 'success'
      ? 'border-success/30 bg-success/10 text-success'
      : status === 'partial'
        ? 'border-warning/30 bg-warning/10 text-warning'
        : 'border-danger/30 bg-danger/10 text-danger'

  return (
    <div className={`rounded-lg border p-3 text-small ${toneClass}`} role="status">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold capitalize">{status}</p>
          <p>
            {result.updated} updated · {result.failed} failed
          </p>
          {result.failures.length > 0 ? (
            <ul className="mt-2 space-y-1 text-caption opacity-90">
              {result.failures.slice(0, 5).map((failure) => (
                <li key={failure.id}>
                  {failure.id}: {failure.reason}
                </li>
              ))}
              {result.failures.length > 5 ? (
                <li>…и ещё {result.failures.length - 5}</li>
              ) : null}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          className="text-caption font-medium underline"
          onClick={onDismiss}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}
