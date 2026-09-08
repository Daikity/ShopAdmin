import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCan } from '@/features/role-switch'
import { useGetAuditLogQuery } from '@/shared/api/auditApi'
import { DatePicker, PageHeader, QueryState } from '@/shared/ui'
import { AuditTable } from '@/widgets/audit-table'
import { useAuditFilters } from '../model/useAuditFilters'

export function AuditLogPage() {
  const { t } = useTranslation()
  const canRead = useCan('audit.read')
  const { filters, setFilters, resetFilters } = useAuditFilters()

  const queryArgs = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      user: filters.user,
      action: filters.action,
      entity: filters.entity,
      from: filters.from,
      to: filters.to,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetAuditLogQuery(queryArgs, { skip: !canRead })

  if (!canRead) {
    return (
      <section>
        <PageHeader
          title={t('audit.pageTitle')}
          description={t('audit.accessDenied')}
        />
        <p className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
          {t('audit.accessDeniedHint')}
        </p>
      </section>
    )
  }

  const hasActiveFilters = Boolean(
    filters.user ||
      filters.action ||
      filters.entity ||
      filters.from ||
      filters.to,
  )

  return (
    <section>
      <PageHeader
        title={t('audit.pageTitle')}
        description={t('audit.pageDescription')}
      />

      <div className="mb-4 grid items-end gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="block space-y-1 text-small">
          <span className="text-text-secondary">{t('audit.filter.user')}</span>
          <input
            value={filters.user ?? ''}
            onChange={(event) =>
              setFilters({
                user: event.target.value.trim() || undefined,
                page: 1,
              })
            }
            placeholder={t('audit.filter.userPlaceholder')}
            className="h-10 w-full rounded-md border border-border px-3 text-small"
            aria-label={t('audit.filter.userAria')}
          />
        </label>
        <label className="block space-y-1 text-small">
          <span className="text-text-secondary">{t('audit.filter.action')}</span>
          <input
            value={filters.action ?? ''}
            onChange={(event) =>
              setFilters({
                action: event.target.value.trim() || undefined,
                page: 1,
              })
            }
            placeholder={t('audit.filter.actionPlaceholder')}
            className="h-10 w-full rounded-md border border-border px-3 text-small"
            aria-label={t('audit.filter.actionAria')}
          />
        </label>
        <label className="block space-y-1 text-small">
          <span className="text-text-secondary">{t('audit.filter.entity')}</span>
          <input
            value={filters.entity ?? ''}
            onChange={(event) =>
              setFilters({
                entity: event.target.value.trim() || undefined,
                page: 1,
              })
            }
            placeholder={t('audit.filter.entityPlaceholder')}
            className="h-10 w-full rounded-md border border-border px-3 text-small"
            aria-label={t('audit.filter.entityAria')}
          />
        </label>
        <DatePicker
          label={t('common.from')}
          value={filters.from ?? ''}
          onChange={(from) => setFilters({ from: from || undefined, page: 1 })}
        />
        <DatePicker
          label={t('common.to')}
          value={filters.to ?? ''}
          onChange={(to) => setFilters({ to: to || undefined, page: 1 })}
        />
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 text-small"
          onClick={() => resetFilters()}
        >
          {t('common.reset')}
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={
          hasActiveFilters ? t('audit.emptyFiltered') : t('audit.empty')
        }
        errorMessage={t('audit.loadError')}
      >
        <AuditTable
          items={data?.items ?? []}
          emptyMessage={t('audit.emptyTable')}
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {t('audit.pagination', {
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
              })}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page <= 1}
                onClick={() => setFilters({ page: data.page - 1 })}
              >
                {t('common.prev')}
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page >= data.totalPages}
                onClick={() => setFilters({ page: data.page + 1 })}
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        ) : null}
      </QueryState>
    </section>
  )
}
