import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  user_id: number
  username: string
  nama: string
  role: string
  level?: string
  pelanggan?: any
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
})

export const { setUser, clearUser, setLoading, setError } = userSlice.actions
export default userSlice.reducer 