import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit'
import {
  DEFAULT_APP_SETTINGS,
  readAppSettings,
  writeAppSettings,
  type AppLocale,
  type AppSettings,
  type TableDensity,
} from '@/shared/config/appSettings'
import { i18n } from '@/shared/config/i18n'

const initialState: AppSettings = readAppSettings()

function persist(state: AppSettings) {
  // current() — снимок без Immer Proxy, чтобы localStorage точно обновился
  writeAppSettings(current(state))
}

function syncI18n(locale: AppLocale) {
  if (i18n.language !== locale) {
    void i18n.changeLanguage(locale)
  }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<AppLocale>) => {
      state.locale = action.payload
      persist(state)
      syncI18n(action.payload)
    },
    setTableDensity: (state, action: PayloadAction<TableDensity>) => {
      state.tableDensity = action.payload
      persist(state)
    },
    setNetworkSimulation: (state, action: PayloadAction<boolean>) => {
      state.networkSimulation = action.payload
      persist(state)
    },
    resetSettings: () => {
      const next = { ...DEFAULT_APP_SETTINGS }
      writeAppSettings(next)
      syncI18n(next.locale)
      return next
    },
  },
})

export const {
  setLocale,
  setTableDensity,
  setNetworkSimulation,
  resetSettings,
} = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer
