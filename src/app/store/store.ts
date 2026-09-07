import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'
import { authApi } from '@/shared/api/authApi'
import { inventoryApi } from '@/shared/api/inventoryApi'
import { ordersApi } from '@/shared/api/ordersApi'
import { pricingApi } from '@/shared/api/pricingApi'
import { productsApi } from '@/shared/api/productsApi'
import { notificationsReducer } from './notificationsSlice'

void authApi
void productsApi
void ordersApi
void inventoryApi
void pricingApi

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
