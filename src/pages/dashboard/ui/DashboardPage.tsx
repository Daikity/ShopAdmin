import { useMemo } from 'react'
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

const PERIOD_OPTIONS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: 'custom', label: 'Custom' },
]

export function DashboardPage() {
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
        title="Dashboard"
        description="KPI магазина, графики и недавние заказы. Период хранится в URL."
      />

      <div className="mb-4 space-y-3 rounded-lg border border-border bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'h-9 rounded-md border px-3 text-small transition',
                filters.period === option.value
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-surface text-text-primary hover:border-accent',
              )}
              onClick={() => {
                if (option.value === 'custom') {
                  setFilters({ period: 'custom' })
                  return
                }
                setFilters({ period: option.value })
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {filters.period === 'custom' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <DatePicker
              label="From"
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
              label="To"
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
        emptyMessage="Нет данных за выбранный период"
        errorMessage="Не удалось загрузить dashboard"
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
