import { useEffect, useMemo, useState } from 'react'
import { ReturnDetailsDrawer } from '@/features/return-change-status'
import { useDebouncedValue } from '@/shared/lib'
import { useGetReturnsQuery } from '@/shared/api/returnsApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { ReturnTable } from '@/widgets/return-table'
import { useReturnsFilters } from '../model/useReturnsFilters'

export function ReturnsPage() {
  const { filters, setFilters, resetFilters } = useReturnsFilters()
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
    useGetReturnsQuery(queryArgs)

  useEffect(() => {
    const nextSearch = debouncedSearch.trim() || undefined
    if (nextSearch === filters.search) return
    setFilters({ search: nextSearch, page: 1 })
  }, [debouncedSearch, filters.search, setFilters])

  const hasActiveFilters = Boolean(filters.search || filters.status)
  const emptyMessage = !hasActiveFilters
    ? 'Пока нет возвратов'
    : 'Нет возвратов по текущим фильтрам'

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
        title="Returns"
        description="Возвраты и status workflow (approve / reject / receive / refund)."
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Поиск по return / order / customer"
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label="Поиск returns"
        />
        <Select
          ariaLabel="Status"
          value={filters.status ?? ''}
          options={[
            { value: '', label: 'Все статусы' },
            { value: 'requested', label: 'requested' },
            { value: 'approved', label: 'approved' },
            { value: 'rejected', label: 'rejected' },
            { value: 'received', label: 'received' },
            { value: 'refunded', label: 'refunded' },
          ]}
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
          Сбросить
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage="Не удалось загрузить returns"
      >
        <ReturnTable
          items={data?.items ?? []}
          emptyMessage={emptyMessage}
          sort={filters.sort}
          onSort={handleSort}
          onOpen={(item) => setSelectedId(item.id)}
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {data.total} возвратов · стр. {data.page}/{data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page <= 1}
                onClick={() => setFilters({ page: data.page - 1 })}
              >
                Назад
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page >= data.totalPages}
                onClick={() => setFilters({ page: data.page + 1 })}
              >
                Далее
              </button>
            </div>
          </div>
        ) : null}
      </QueryState>

      <ReturnDetailsDrawer
        returnId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </section>
  )
}
