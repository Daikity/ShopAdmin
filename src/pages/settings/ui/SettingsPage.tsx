import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import {
  resetSettings,
  setLocale,
  setNetworkSimulation,
  setTableDensity,
} from '@/app/store'
import type { AppLocale, TableDensity } from '@/shared/config/appSettings'
import { notifyToast } from '@/shared/lib'
import { Checkbox, PageHeader, Select } from '@/shared/ui'

export function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const settings = useSelector((state: RootState) => state.settings)

  return (
    <section>
      <PageHeader
        title="Settings"
        description="Locale stub, плотность таблиц и симуляция сети для демо rollback."
      />

      <div className="max-w-xl space-y-4 rounded-lg border border-border bg-surface p-4 shadow-panel">
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">Locale (полный i18n — Phase 9)</p>
          <Select
            ariaLabel="Locale"
            value={settings.locale}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ru', label: 'Русский' },
              { value: 'de', label: 'Deutsch' },
            ]}
            onChange={(value) => {
              dispatch(setLocale(value as AppLocale))
              notifyToast({
                tone: 'success',
                message: `Locale: ${value} (i18n в Phase 9)`,
              })
            }}
          />
        </div>

        <div className="space-y-1 text-small">
          <p className="text-text-secondary">Table density</p>
          <Select
            ariaLabel="Table density"
            value={settings.tableDensity}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
            onChange={(value) => {
              dispatch(setTableDensity(value as TableDensity))
              notifyToast({
                tone: 'success',
                message: `Table density: ${value}`,
              })
            }}
          />
        </div>

        <Checkbox
          checked={settings.networkSimulation}
          onChange={(checked) => {
            dispatch(setNetworkSimulation(checked))
            notifyToast({
              tone: checked ? 'warning' : 'success',
              message: checked
                ? 'Network simulation ON — каждый 2-й PATCH order/inventory → 500'
                : 'Network simulation OFF',
            })
          }}
          label="Network simulation"
          description="Каждый второй PATCH /orders/:id или /inventory/:id вернёт 500 (дольше latency). Проверка: Inventory → Adjust или Order → смена статуса."
        />

        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 text-small transition hover:border-accent hover:bg-surface-muted"
          onClick={() => {
            dispatch(resetSettings())
            notifyToast({ tone: 'success', message: 'Settings сброшены' })
          }}
        >
          Сбросить settings
        </button>
      </div>
    </section>
  )
}
