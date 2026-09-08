import { useMemo } from 'react'
import { useGetCustomersQuery } from '@/shared/api/customersApi'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/shared/api/productsApi'
import { useGetReportsQuery } from '@/shared/api/reportsApi'
import { PageHeader, QueryState, Select, DatePicker } from '@/shared/ui'
import {
  ReportsByCustomer,
  ReportsCategoryChart,
  ReportsKpiGrid,
  ReportsOrdersChart,
  ReportsRevenueChart,
  ReportsTopProducts,
} from '@/widgets/reports'
import { hasReportsData } from '../model/hasReportsData'
import { useReportsFilters } from '../model/useReportsFilters'

export function ReportsPage() {
  const { filters, setFilters, resetFilters } = useReportsFilters()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    limit: 100,
    sort: 'name:asc',
  })
  const { data: customersData } = useGetCustomersQuery({
    page: 1,
    limit: 100,
    sort: 'name:asc',
  })

  const queryArgs = useMemo(
    () => ({
      from: filters.from,
      to: filters.to,
      categoryId: filters.categoryId,
      productId: filters.productId,
      customerId: filters.customerId,
      paymentStatus: filters.paymentStatus,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetReportsQuery(queryArgs)

  const isEmpty = isSuccess && data ? !hasReportsData(data) : false

  return (
    <section>
      <PageHeader
        title="Reports"
        description="Выручка, заказы, категории и топы. Все фильтры — в URL."
      />

      <div className="mb-4 grid items-end gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-2 xl:grid-cols-3">
        <DatePicker
          label="From"
          value={filters.from}
          onChange={(from) => setFilters({ from })}
        />
        <DatePicker
          label="To"
          value={filters.to}
          onChange={(to) => setFilters({ to })}
        />
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">Category</p>
          <Select
            ariaLabel="Category"
            value={filters.categoryId ?? ''}
            options={[
              { value: '', label: 'Все категории' },
              ...categories.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
            onChange={(value) =>
              setFilters({ categoryId: value || undefined })
            }
          />
        </div>
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">Product</p>
          <Select
            ariaLabel="Product"
            value={filters.productId ?? ''}
            options={[
              { value: '', label: 'Все товары' },
              ...(productsData?.items ?? []).map((item) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
            onChange={(value) => setFilters({ productId: value || undefined })}
          />
        </div>
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">Customer</p>
          <Select
            ariaLabel="Customer"
            value={filters.customerId ?? ''}
            options={[
              { value: '', label: 'Все клиенты' },
              ...(customersData?.items ?? []).map((item) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
            onChange={(value) =>
              setFilters({ customerId: value || undefined })
            }
          />
        </div>
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">Payment status</p>
          <Select
            ariaLabel="Payment status"
            value={filters.paymentStatus ?? ''}
            options={[
              { value: '', label: 'Все payment status' },
              { value: 'pending', label: 'pending' },
              { value: 'paid', label: 'paid' },
              { value: 'failed', label: 'failed' },
              { value: 'refunded', label: 'refunded' },
            ]}
            onChange={(value) =>
              setFilters({
                paymentStatus: (value ||
                  undefined) as typeof filters.paymentStatus,
              })
            }
          />
        </div>
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 text-small transition hover:border-accent hover:bg-surface-muted md:col-span-2 xl:col-span-3"
          onClick={() => resetFilters()}
        >
          Сбросить фильтры
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isEmpty}
        emptyMessage="Нет данных по текущим фильтрам"
        errorMessage="Не удалось загрузить reports"
      >
        {data ? (
          <div className="space-y-4">
            <ReportsKpiGrid kpis={data.kpis} />
            <div className="grid gap-4 xl:grid-cols-2">
              <ReportsRevenueChart data={data.revenueOverTime} />
              <ReportsOrdersChart data={data.ordersOverTime} />
            </div>
            <ReportsCategoryChart data={data.byCategory} />
            <div className="grid gap-4 xl:grid-cols-2">
              <ReportsTopProducts items={data.topProducts} />
              <ReportsByCustomer items={data.byCustomer} />
            </div>
          </div>
        ) : null}
      </QueryState>
    </section>
  )
}
