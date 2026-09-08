import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ReturnAction, ReturnItem } from '@/entities/return'
import {
  getAvailableReturnActions,
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

const RETURN_ACTION_KEYS = {
  approve: 'returns.workflow.approve',
  reject: 'returns.workflow.reject',
  receive: 'returns.workflow.receive',
  refund: 'returns.workflow.refund',
} as const

export function ReturnStatusActions({
  item,
  onDone,
}: ReturnStatusActionsProps) {
  const { t } = useTranslation()
  const [pendingAction, setPendingAction] = useState<ReturnAction | null>(null)
  const [changeStatus, { isLoading }] = useChangeReturnStatusMutation()
  const canWrite = useCan('returns.write')
  const actions = canWrite ? getAvailableReturnActions(item.status) : []

  function actionLabel(action: ReturnAction) {
    return t(RETURN_ACTION_KEYS[action])
  }

  async function apply(action: ReturnAction) {
    try {
      await changeStatus({
        id: item.id,
        status: resolveReturnActionStatus(action),
      }).unwrap()
      notifyToast({
        tone: 'success',
        message: t('returns.toast.success', {
          number: item.number,
          action: actionLabel(action),
        }),
      })
      onDone?.()
    } catch {
      notifyToast({
        tone: 'error',
        message: t('returns.toast.failed', { number: item.number }),
      })
    } finally {
      setPendingAction(null)
    }
  }

  if (actions.length === 0) {
    return (
      <p className="text-small text-text-secondary">
        {!canWrite
          ? t('returns.action.noPermission')
          : t('returns.action.noneForStatus', {
              status: t(`enums.returnStatus.${item.status}`),
            })}
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
            {actionLabel(action)}
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title={t('returns.confirmTitle')}
        description={
          pendingAction
            ? t('returns.confirmDescription', {
                action: actionLabel(pendingAction),
                number: item.number,
              })
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
