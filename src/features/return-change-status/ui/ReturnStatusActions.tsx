import { useState } from 'react'
import type { ReturnAction, ReturnItem } from '@/entities/return'
import {
  getAvailableReturnActions,
  getReturnActionLabel,
  isDestructiveReturnAction,
  resolveReturnActionStatus,
} from '@/entities/return'
import { useCan } from '@/features/role-switch'
import { notifyToast } from '@/shared/lib'
import { useChangeReturnStatusMutation } from '@/shared/api/returnsApi'
import { ConfirmDialog } from '@/shared/ui'

type ReturnStatusActionsProps = {
  item: ReturnItem
  onDone?: () => void
}

export function ReturnStatusActions({
  item,
  onDone,
}: ReturnStatusActionsProps) {
  const [pendingAction, setPendingAction] = useState<ReturnAction | null>(null)
  const [changeStatus, { isLoading }] = useChangeReturnStatusMutation()
  const canWrite = useCan('returns.write')
  const actions = canWrite ? getAvailableReturnActions(item.status) : []

  async function apply(action: ReturnAction) {
    try {
      await changeStatus({
        id: item.id,
        status: resolveReturnActionStatus(action),
      }).unwrap()
      notifyToast({
        tone: 'success',
        message: `${item.number}: ${getReturnActionLabel(action)}`,
      })
      onDone?.()
    } catch {
      notifyToast({
        tone: 'error',
        message: `${item.number}: action failed`,
      })
    } finally {
      setPendingAction(null)
    }
  }

  if (actions.length === 0) {
    return (
      <p className="text-small text-text-secondary">
        {!canWrite
          ? 'Нет permission returns.write'
          : `Нет доступных действий для «${item.status}».`}
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            disabled={isLoading}
            className={[
              'rounded-md px-3 py-2 text-small font-medium disabled:opacity-50',
              isDestructiveReturnAction(action)
                ? 'border border-danger/40 text-danger'
                : 'bg-accent text-accent-foreground hover:bg-accent-hover',
            ].join(' ')}
            onClick={() => {
              if (isDestructiveReturnAction(action)) {
                setPendingAction(action)
                return
              }
              void apply(action)
            }}
          >
            {getReturnActionLabel(action)}
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title="Отклонить возврат?"
        description={
          pendingAction
            ? `${getReturnActionLabel(pendingAction)} для ${item.number}?`
            : null
        }
        tone="danger"
        isPending={isLoading}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          if (pendingAction) void apply(pendingAction)
        }}
      />
    </>
  )
}
