import type { DashboardKpis } from '@/entities/dashboard'
import { formatMoney, formatPercent } from '@/shared/lib'

type DashboardKpiGridProps = {
  kpis: DashboardKpis
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <p className="text-caption text-text-secondary">{label}</p>
      <p className="mt-2 text-h2 tabular-nums">{value}</p>
    </div>
  )
}

export function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <KpiCard label="Revenue" value={formatMoney(kpis.revenue)} />
      <KpiCard label="Orders" value={String(kpis.orders)} />
      <KpiCard label="AOV" value={formatMoney(kpis.aov)} />
      <KpiCard label="Conversion" value={formatPercent(kpis.conversion)} />
      <KpiCard label="Refunds" value={formatMoney(kpis.refunds)} />
      <KpiCard label="Low Stock" value={String(kpis.lowStock)} />
    </div>
  )
}
