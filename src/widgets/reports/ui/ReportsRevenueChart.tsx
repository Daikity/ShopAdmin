import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReportRevenuePoint } from '@/entities/report'
import { formatMoney } from '@/shared/lib'

type ReportsRevenueChartProps = {
  data: ReportRevenuePoint[]
}

export function ReportsRevenueChart({ data }: ReportsRevenueChartProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <h2 className="text-h2">Revenue</h2>
      <p className="mt-1 text-small text-text-secondary">Area chart по датам</p>
      {data.length === 0 ? (
        <p className="py-16 text-center text-small text-text-secondary">
          Нет данных
        </p>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="reportsRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#cfd8d4" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#5b6b64', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#5b6b64', fontSize: 12 }}
                tickFormatter={(value: number) =>
                  `€${Math.round(value / 1000)}k`
                }
              />
              <Tooltip
                formatter={(value) => formatMoney(Number(value))}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: '#cfd8d4',
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0f766e"
                strokeWidth={2}
                fill="url(#reportsRevenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
