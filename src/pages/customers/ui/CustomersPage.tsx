import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebouncedValue } from '@/shared/lib'
import { useGetCustomersQuery } from '@/shared/api/customersApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { CustomerTable } from '@/widgets/customer-table'
import { useCustomersFilters } from '../model/useCustomersFilters'

export function CustomersPage() {
  const { t } = useTranslation()
  const { filters, setFilters, resetFilters } = useCustomersFilters()
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const queryArgs = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      status: filters.status,
      sort: filters.sort,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetCustomersQuery(queryArgs)

  useEffect(() => {
    const nextSearch = debouncedSearch.trim() || undefined
    if (nextSearch === filters.search) return
    setFilters({ search: nextSearch, page: 1 })
  }, [debouncedSearch, filters.search, setFilters])

  const hasActiveFilters = Boolean(filters.search || filters.status)
  const emptyMessage = !hasActiveFilters
    ? t('customers.empty')
    : t('customers.emptyFiltered')

  const statusOptions = useMemo(
    () => [
      { value: '', label: t('common.allStatuses') },
      { value: 'active', label: t('enums.customerStatus.active') },
      { value: 'blocked', label: t('enums.customerStatus.blocked') },
      { value: 'invited', label: t('enums.customerStatus.invited') },
    ],
    [t],
  )

  function handleSort(field: string) {
    const [currentField, currentOrder] = (
      filters.sort ?? 'createdAt:desc'
    ).split(':')
    const nextOrder =
      currentField === field && currentOrder === 'asc' ? 'desc' : 'asc'
    setFilters({ sort: `${field}:${nextOrder}`, page: 1 })
  }

  return (
    <section>
      <PageHeader
        title={t('customers.pageTitle')}
        description={t('customers.pageDescription')}
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('customers.searchPlaceholder')}
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label={t('customers.searchAria')}
        />
        <Select
          ariaLabel={t('customers.statusAria')}
          value={filters.status ?? ''}
          options={statusOptions}
          onChange={(value) =>
            setFilters({
              status: (value || undefined) as typeof filters.status,
              page: 1,
            })
          }
        />
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 text-small"
          onClick={() => {
            setSearchInput('')
            resetFilters()
          }}
        >
          {t('common.reset')}
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage={t('customers.loadError')}
      >
        <CustomerTable
          items={data?.items ?? []}
          emptyMessage={emptyMessage}
          sort={filters.sort}
          onSort={handleSort}
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {t('customers.pagination', {
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
