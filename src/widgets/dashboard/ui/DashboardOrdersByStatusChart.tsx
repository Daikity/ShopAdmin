import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardStatusPoint } from '@/entities/dashboard'

type DashboardOrdersByStatusChartProps = {
  data: DashboardStatusPoint[]
}

export function DashboardOrdersByStatusChart({
  data,
}: DashboardOrdersByStatusChartProps) {
  const hasData = data.some((item) => item.count > 0)

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <h2 className="text-h2">Orders by status</h2>
      <p className="mt-1 text-small text-text-secondary">
        Распределение статусов в периоде
      </p>
      {!hasData ? (
        <p className="py-16 text-center text-small text-text-secondary">
          Нет заказов за период
        </p>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#cfd8d4" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#5b6b64', fontSize: 11 }}
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
              <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
