import type { ReactNode } from 'react'

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
  errorMessage = 'Не удалось загрузить данные',
  emptyMessage = 'Нет данных',
  loadingFallback,
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
          Загрузка…
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
        {errorMessage}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="relative">
      {isFetching ? (
        <p className="absolute top-0 right-0 text-caption text-text-secondary">
          Обновление…
        </p>
      ) : null}
      {children}
    </div>
  )
}
