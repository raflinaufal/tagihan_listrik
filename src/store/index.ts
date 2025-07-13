import { configureStore } from '@reduxjs/toolkit'
import pelangganReducer from './pelangganSlice'
import penggunaanReducer from './penggunaanSlice'
import tagihanReducer from './tagihanSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    pelanggan: pelangganReducer,
    penggunaan: penggunaanReducer,
    tagihan: tagihanReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 