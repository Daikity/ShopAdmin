import { ReturnStatusActions } from '@/features/return-change-status'
import { useGetReturnQuery } from '@/shared/api/returnsApi'
import { QueryState } from '@/shared/ui'

type ReturnDetailsDrawerProps = {
  returnId: string | null
  onClose: () => void
}

export function ReturnDetailsDrawer({
  returnId,
  onClose,
}: ReturnDetailsDrawerProps) {
  const { data, isLoading, isError, isFetching, isSuccess } = useGetReturnQuery(
    returnId ?? '',
    { skip: !returnId },
  )

  if (!returnId) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-text-primary/40">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <aside
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-drawer-title"
      >
        <div className="flex items-start justify-between border-b border-border p-4">
          <div>
            <h2 id="return-drawer-title" className="text-h2">
              {data?.number ?? 'Return'}
            </h2>
            <p className="text-small text-text-secondary">
              {data
                ? `${data.orderNumber} · ${data.customerName}`
                : 'Детали возврата'}
            </p>
          </div>
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 text-small"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <QueryState
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching && isSuccess}
            errorMessage="Возврат не найден"
          >
            {data ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-3 text-small">
                  <p>
                    <span className="text-text-secondary">Product:</span>{' '}
                    {data.productName}
                  </p>
                  <p className="mt-1">
                    <span className="text-text-secondary">Reason:</span>{' '}
                    {data.reason}
                  </p>
                  <p className="mt-1">
                    <span className="text-text-secondary">Amount:</span> €
                    {data.amount.toFixed(2)}
                  </p>
                  <p className="mt-1 capitalize">
                    <span className="text-text-secondary">Status:</span>{' '}
                    {data.status}
                  </p>
                  {data.note ? (
                    <p className="mt-1">
                      <span className="text-text-secondary">Note:</span>{' '}
                      {data.note}
                    </p>
                  ) : null}
                </div>

                <div>
                  <h3 className="mb-2 text-small font-semibold text-text-secondary">
                    Actions
                  </h3>
                  <ReturnStatusActions item={data} />
                </div>
              </div>
            ) : null}
          </QueryState>
        </div>
      </aside>
    </div>
  )
}
