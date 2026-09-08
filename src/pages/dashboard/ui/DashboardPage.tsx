import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DashboardPeriod } from '@/entities/dashboard'
import { useGetDashboardQuery } from '@/shared/api/dashboardApi'
import { cn } from '@/shared/lib'
import { PageHeader, QueryState, DatePicker } from '@/shared/ui'
import {
  DashboardKpiGrid,
  DashboardOrdersByStatusChart,
  DashboardRecentOrders,
  DashboardRevenueChart,
  DashboardTopProducts,
} from '@/widgets/dashboard'
import { hasDashboardData } from '../model/hasDashboardData'
import { useDashboardFilters } from '../model/useDashboardFilters'

const PERIOD_VALUES: DashboardPeriod[] = [
  'today',
  '7d',
  '30d',
  '90d',
  'custom',
]

export function DashboardPage() {
  const { t } = useTranslation()
  const { filters, setFilters } = useDashboardFilters()

  const queryArgs = useMemo(
    () => ({
      from: filters.from,
      to: filters.to,
    }),
    [filters.from, filters.to],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetDashboardQuery(queryArgs)

  const isEmpty = isSuccess && data ? !hasDashboardData(data) : false

  return (
    <section>
      <PageHeader
        title={t('dashboard.pageTitle')}
        description={t('dashboard.pageDescription')}
      />

      <div className="mb-4 space-y-3 rounded-lg border border-border bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          {PERIOD_VALUES.map((period) => (
            <button
              key={period}
              type="button"
              className={cn(
                'h-9 rounded-md border px-3 text-small transition',
                filters.period === period
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-surface text-text-primary hover:border-accent',
              )}
              onClick={() => {
                if (period === 'custom') {
                  setFilters({ period: 'custom' })
                  return
                }
                setFilters({ period })
              }}
            >
              {t(`dashboard.period.${period}`)}
            </button>
          ))}
        </div>

        {filters.period === 'custom' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <DatePicker
              label={t('common.from')}
              value={filters.from}
              onChange={(from) =>
                setFilters({
                  from,
                  to: filters.to,
                  period: 'custom',
                })
              }
            />
            <DatePicker
              label={t('common.to')}
              value={filters.to}
              onChange={(to) =>
                setFilters({
                  from: filters.from,
                  to,
                  period: 'custom',
                })
              }
            />
          </div>
        ) : null}
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isEmpty}
        emptyMessage={t('dashboard.empty')}
        errorMessage={t('dashboard.loadError')}
      >
        {data ? (
          <div className="space-y-4">
            <DashboardKpiGrid kpis={data.kpis} />
            <div className="grid gap-4 xl:grid-cols-2">
              <DashboardRevenueChart data={data.revenueOverTime} />
              <DashboardOrdersByStatusChart data={data.ordersByStatus} />
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <DashboardTopProducts items={data.topProducts} />
              <DashboardRecentOrders items={data.recentOrders} />
            </div>
          </div>
        ) : null}
      </QueryState>
    </section>
  )
}
