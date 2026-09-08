import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReportOrdersPoint } from '@/entities/report'

type ReportsOrdersChartProps = {
  data: ReportOrdersPoint[]
}

export function ReportsOrdersChart({ data }: ReportsOrdersChartProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <h2 className="text-h2">Orders</h2>
      <p className="mt-1 text-small text-text-secondary">Bar chart по датам</p>
      {data.length === 0 ? (
        <p className="py-16 text-center text-small text-text-secondary">
          Нет данных
        </p>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#cfd8d4" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#5b6b64', fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#5b6b64', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: '#cfd8d4',
                  fontSize: 13,
                }}
              />
              <Bar dataKey="orders" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
