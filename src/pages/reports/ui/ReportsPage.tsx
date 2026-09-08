import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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

  const categoryOptions = useMemo(
    () => [
      { value: '', label: t('common.allCategories') },
      ...categories.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [categories, t],
  )

  const productOptions = useMemo(
    () => [
      { value: '', label: t('common.allProducts') },
      ...(productsData?.items ?? []).map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [productsData?.items, t],
  )

  const customerOptions = useMemo(
    () => [
      { value: '', label: t('common.allCustomers') },
      ...(customersData?.items ?? []).map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [customersData?.items, t],
  )

  const paymentOptions = useMemo(
    () => [
      { value: '', label: t('reports.allPaymentStatuses') },
      { value: 'pending', label: t('enums.paymentStatus.pending') },
      { value: 'paid', label: t('enums.paymentStatus.paid') },
      { value: 'failed', label: t('enums.paymentStatus.failed') },
      { value: 'refunded', label: t('enums.paymentStatus.refunded') },
    ],
    [t],
  )

  return (
    <section>
      <PageHeader
        title={t('reports.pageTitle')}
        description={t('reports.pageDescription')}
      />

      <div className="mb-4 grid items-end gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-2 xl:grid-cols-3">
        <DatePicker
          label={t('common.from')}
          value={filters.from}
          onChange={(from) => setFilters({ from })}
        />
        <DatePicker
          label={t('common.to')}
          value={filters.to}
          onChange={(to) => setFilters({ to })}
        />
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">{t('reports.filter.category')}</p>
          <Select
            ariaLabel={t('reports.filter.categoryAria')}
            value={filters.categoryId ?? ''}
            options={categoryOptions}
            onChange={(value) =>
              setFilters({ categoryId: value || undefined })
            }
          />
        </div>
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">{t('reports.filter.product')}</p>
          <Select
            ariaLabel={t('reports.filter.productAria')}
            value={filters.productId ?? ''}
            options={productOptions}
            onChange={(value) => setFilters({ productId: value || undefined })}
          />
        </div>
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">{t('reports.filter.customer')}</p>
          <Select
            ariaLabel={t('reports.filter.customerAria')}
            value={filters.customerId ?? ''}
            options={customerOptions}
            onChange={(value) =>
              setFilters({ customerId: value || undefined })
            }
          />
        </div>
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">{t('reports.filter.payment')}</p>
          <Select
            ariaLabel={t('reports.filter.paymentAria')}
            value={filters.paymentStatus ?? ''}
            options={paymentOptions}
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
          {t('reports.resetFilters')}
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isEmpty}
        emptyMessage={t('reports.empty')}
        errorMessage={t('reports.loadError')}
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
