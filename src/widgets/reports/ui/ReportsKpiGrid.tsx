import { useTranslation } from 'react-i18next'
import type { ReportsKpis } from '@/entities/report'
import { formatMoney } from '@/shared/lib'

type ReportsKpiGridProps = {
  kpis: ReportsKpis
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <p className="text-caption text-text-secondary">{label}</p>
      <p className="mt-2 text-h2 tabular-nums">{value}</p>
    </div>
  )
}

export function ReportsKpiGrid({ kpis }: ReportsKpiGridProps) {
  const { t } = useTranslation()
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label={t('reports.kpi.revenue')} value={formatMoney(kpis.revenue)} />
      <KpiCard label={t('reports.kpi.orders')} value={String(kpis.orders)} />
      <KpiCard label={t('reports.kpi.aov')} value={formatMoney(kpis.aov)} />
      <KpiCard
        label={t('reports.kpi.refunds')}
        value={formatMoney(kpis.refunds)}
      />
    </div>
  )
}
