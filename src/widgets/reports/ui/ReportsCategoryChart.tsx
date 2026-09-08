import { useTranslation } from 'react-i18next'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { ReportCategoryItem } from '@/entities/report'
import { formatMoney } from '@/shared/lib'

const COLORS = ['#0f766e', '#0d9488', '#14b8a6', '#5b6b64', '#b45309']

type ReportsCategoryChartProps = {
  data: ReportCategoryItem[]
}

export function ReportsCategoryChart({ data }: ReportsCategoryChartProps) {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <h2 className="text-h2">{t('reports.chart.categoryTitle')}</h2>
      <p className="mt-1 text-small text-text-secondary">
        {t('reports.chart.categorySubtitle')}
      </p>
      {data.length === 0 ? (
        <p className="py-16 text-center text-small text-text-secondary">
          {t('reports.chart.empty')}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="categoryName"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.categoryId}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatMoney(Number(value))}
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: '#cfd8d4',
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2 self-center text-small">
            {data.map((item, index) => (
              <li
                key={item.categoryId}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate">{item.categoryName}</span>
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatMoney(item.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
