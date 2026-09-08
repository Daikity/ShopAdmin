import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'
import { authApi } from '@/shared/api/authApi'
import { auditApi } from '@/shared/api/auditApi'
import { customersApi } from '@/shared/api/customersApi'
import { dashboardApi } from '@/shared/api/dashboardApi'
import { inventoryApi } from '@/shared/api/inventoryApi'
import { ordersApi } from '@/shared/api/ordersApi'
import { pricingApi } from '@/shared/api/pricingApi'
import { productsApi } from '@/shared/api/productsApi'
import { reportsApi } from '@/shared/api/reportsApi'
import { returnsApi } from '@/shared/api/returnsApi'
import { rolesApi } from '@/shared/api/rolesApi'
import { usersApi } from '@/shared/api/usersApi'
import { demoRoleReducer } from './demoRoleSlice'
import { notificationsReducer } from './notificationsSlice'
import { settingsReducer } from './settingsSlice'

void authApi
void productsApi
void ordersApi
void inventoryApi
void pricingApi
void returnsApi
void customersApi
void dashboardApi
void reportsApi
void usersApi
void rolesApi
void auditApi

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    notifications: notificationsReducer,
    demoRole: demoRoleReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
