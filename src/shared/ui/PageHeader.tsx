import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  back?: {
    to: string
    label?: string
  }
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: PageHeaderProps) {
  return (
    <div className="mb-4 space-y-3 sm:mb-6">
      {back ? (
        <Link
          to={back.to}
          className="inline-flex items-center gap-1 text-small text-text-secondary hover:text-accent"
        >
          ← {back.label ?? 'Назад'}
        </Link>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-h1">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-small text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
