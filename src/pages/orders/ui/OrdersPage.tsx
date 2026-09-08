import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebouncedValue } from '@/shared/lib'
import { useGetOrdersQuery } from '@/shared/api/ordersApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { OrderTable } from '@/widgets/order-table'
import { useOrdersFilters } from '../model/useOrdersFilters'

export function OrdersPage() {
  const { t } = useTranslation()
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
      { value: '', label: t('common.allStatuses') },
      { value: 'pending', label: t('enums.orderStatus.pending') },
      { value: 'confirmed', label: t('enums.orderStatus.confirmed') },
      { value: 'processing', label: t('enums.orderStatus.processing') },
      { value: 'shipped', label: t('enums.orderStatus.shipped') },
      { value: 'delivered', label: t('enums.orderStatus.delivered') },
      { value: 'cancelled', label: t('enums.orderStatus.cancelled') },
      { value: 'refunded', label: t('enums.orderStatus.refunded') },
    ],
    [t],
  )

  const paymentOptions = useMemo(
    () => [
      { value: '', label: t('orders.allPayment') },
      { value: 'pending', label: t('enums.paymentStatus.pending') },
      { value: 'paid', label: t('enums.paymentStatus.paid') },
      { value: 'failed', label: t('enums.paymentStatus.failed') },
      { value: 'refunded', label: t('enums.paymentStatus.refunded') },
    ],
    [t],
  )

  const fulfillmentOptions = useMemo(
    () => [
      { value: '', label: t('orders.allFulfillment') },
      { value: 'unfulfilled', label: t('enums.fulfillmentStatus.unfulfilled') },
      { value: 'partial', label: t('enums.fulfillmentStatus.partial') },
      { value: 'fulfilled', label: t('enums.fulfillmentStatus.fulfilled') },
      { value: 'returned', label: t('enums.fulfillmentStatus.returned') },
    ],
    [t],
  )

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.paymentStatus ||
      filters.fulfillmentStatus,
  )

  const emptyMessage = !hasActiveFilters
    ? t('orders.empty')
    : t('orders.emptyFiltered')

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
        title={t('orders.pageTitle')}
        description={t('orders.pageDescription')}
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('orders.searchPlaceholder')}
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label={t('orders.searchAria')}
        />
        <Select
          ariaLabel={t('orders.statusAria')}
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
          ariaLabel={t('orders.paymentAria')}
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
          ariaLabel={t('orders.fulfillmentAria')}
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
          {t('common.reset')}
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage={t('orders.loadError')}
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
              {selectedIds.length > 0
                ? t('common.paginationSelected', {
                    total: data.total,
                    page: data.page,
                    totalPages: data.totalPages,
                    selected: selectedIds.length,
                  })
                : t('orders.pagination', {
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
