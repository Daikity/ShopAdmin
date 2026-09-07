import { useEffect, useMemo, useState } from 'react'
import { useDebouncedValue } from '@/shared/lib'
import { useGetOrdersQuery } from '@/shared/api/ordersApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { OrderTable } from '@/widgets/order-table'
import { useOrdersFilters } from '../model/useOrdersFilters'

export function OrdersPage() {
  const { filters, setFilters, resetFilters } = useOrdersFilters()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const queryArgs = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      status: filters.status,
      paymentStatus: filters.paymentStatus,
      fulfillmentStatus: filters.fulfillmentStatus,
      sort: filters.sort,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetOrdersQuery(queryArgs)

  useEffect(() => {
    const nextSearch = debouncedSearch.trim() || undefined
    if (nextSearch === filters.search) return
    setFilters({ search: nextSearch, page: 1 })
  }, [debouncedSearch, filters.search, setFilters])

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'Все статусы' },
      { value: 'pending', label: 'pending' },
      { value: 'confirmed', label: 'confirmed' },
      { value: 'processing', label: 'processing' },
      { value: 'shipped', label: 'shipped' },
      { value: 'delivered', label: 'delivered' },
      { value: 'cancelled', label: 'cancelled' },
      { value: 'refunded', label: 'refunded' },
    ],
    [],
  )

  const paymentOptions = useMemo(
    () => [
      { value: '', label: 'Все payment' },
      { value: 'pending', label: 'pending' },
      { value: 'paid', label: 'paid' },
      { value: 'failed', label: 'failed' },
      { value: 'refunded', label: 'refunded' },
    ],
    [],
  )

  const fulfillmentOptions = useMemo(
    () => [
      { value: '', label: 'Все fulfillment' },
      { value: 'unfulfilled', label: 'unfulfilled' },
      { value: 'partial', label: 'partial' },
      { value: 'fulfilled', label: 'fulfilled' },
      { value: 'returned', label: 'returned' },
    ],
    [],
  )

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.paymentStatus ||
      filters.fulfillmentStatus,
  )

  const emptyMessage = !hasActiveFilters
    ? 'Пока нет заказов'
    : 'Нет заказов по текущим фильтрам'

  function handleSort(field: string) {
    const [currentField, currentOrder] = (filters.sort ?? 'createdAt:desc').split(
      ':',
    )
    const nextOrder =
      currentField === field && currentOrder === 'asc' ? 'desc' : 'asc'
    setFilters({ sort: `${field}:${nextOrder}`, page: 1 })
  }

  return (
    <section>
      <PageHeader
        title="Orders"
        description="Таблица заказов, URL-фильтры и status workflow с optimistic UI."
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Поиск по номеру / клиенту"
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label="Поиск заказов"
        />
        <Select
          ariaLabel="Статус заказа"
          value={filters.status ?? ''}
          options={statusOptions}
          onChange={(value) =>
            setFilters({
              status: (value || undefined) as typeof filters.status,
              page: 1,
            })
          }
        />
        <Select
          ariaLabel="Payment status"
          value={filters.paymentStatus ?? ''}
          options={paymentOptions}
          onChange={(value) =>
            setFilters({
              paymentStatus: (value || undefined) as typeof filters.paymentStatus,
              page: 1,
            })
          }
        />
        <Select
          ariaLabel="Fulfillment status"
          value={filters.fulfillmentStatus ?? ''}
          options={fulfillmentOptions}
          onChange={(value) =>
            setFilters({
              fulfillmentStatus: (value ||
                undefined) as typeof filters.fulfillmentStatus,
              page: 1,
            })
          }
        />
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 text-small md:col-span-4 md:w-fit"
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
        errorMessage="Не удалось загрузить заказы"
      >
        <OrderTable
          items={data?.items ?? []}
          selectedIds={selectedIds}
          sort={filters.sort}
          onSort={handleSort}
          emptyMessage={emptyMessage}
          onToggle={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
            )
          }
          onToggleAll={(ids) =>
            setSelectedIds((prev) =>
              ids.every((id) => prev.includes(id))
                ? prev.filter((id) => !ids.includes(id))
                : [...new Set([...prev, ...ids])],
            )
          }
        />

        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {data.total} заказов · стр. {data.page}/{data.totalPages}
              {selectedIds.length > 0 ? ` · выбрано ${selectedIds.length}` : ''}
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
    </section>
  )
}
