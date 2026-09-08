import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit'
import {
  DEFAULT_APP_SETTINGS,
  readAppSettings,
  writeAppSettings,
  type AppLocale,
  type AppSettings,
  type TableDensity,
} from '@/shared/config/appSettings'

const initialState: AppSettings = readAppSettings()

function persist(state: AppSettings) {
  // current() — снимок без Immer Proxy, чтобы localStorage точно обновился
  writeAppSettings(current(state))
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<AppLocale>) => {
      state.locale = action.payload
      persist(state)
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
