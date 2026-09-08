import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type QueryStateProps = {
  isLoading: boolean
  isError: boolean
  isEmpty?: boolean
  isFetching?: boolean
  errorMessage?: string
  emptyMessage?: string
  loadingFallback?: ReactNode
  children: ReactNode
}

/** Унифицированные loading / error / empty / refetching для server state. */
export function QueryState({
  isLoading,
  isError,
  isEmpty = false,
  isFetching = false,
  errorMessage,
  emptyMessage,
  loadingFallback,
  children,
}: QueryStateProps) {
  const { t } = useTranslation()
  const resolvedError = errorMessage ?? t('common.loadError')
  const resolvedEmpty = emptyMessage ?? t('common.empty')

  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
          {t('common.loading')}
        </div>
      )
    )
  }

  if (isError) {
    return (
      <div
        className="rounded-md border border-danger/30 bg-danger/5 p-6 text-small text-danger"
        role="alert"
      >
        {resolvedError}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
        {resolvedEmpty}
      </div>
    )
  }

  return (
    <div className="relative" aria-busy={isFetching || undefined}>
      {isFetching ? (
        <p className="absolute top-0 right-0 text-caption text-text-secondary">
          {t('common.updating')}
        </p>
      ) : null}
      {children}
    </div>
  )
}
