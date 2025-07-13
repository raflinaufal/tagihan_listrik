import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Penggunaan {
  id_penggunaan: number
  id_pelanggan: number
  bulan: string
  tahun: number
  meter_awal: number
  meter_ahir: number
}

interface PenggunaanState {
  data: Penggunaan[]
  loading: boolean
  error: string | null
}

const initialState: PenggunaanState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchPenggunaan = createAsyncThunk('penggunaan/fetch', async () => {
  const res = await fetch('/api/penggunaan')
  if (!res.ok) throw new Error('Gagal fetch penggunaan')
  return await res.json()
})

const penggunaanSlice = createSlice({
  name: 'penggunaan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPenggunaan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPenggunaan.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchPenggunaan.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Gagal fetch penggunaan'
      })
  },
})

export default penggunaanSlice.reducer 