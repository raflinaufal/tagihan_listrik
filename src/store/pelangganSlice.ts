import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Pelanggan {
  id_pelanggan: number
  nama_pelanggan: string
  alamat: string
  tarif: {
    daya: number
    tarifperkwh: number
  } | null
}

interface PelangganState {
  data: Pelanggan[]
  loading: boolean
  error: string | null
}

const initialState: PelangganState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchPelanggan = createAsyncThunk('pelanggan/fetch', async () => {
  const res = await fetch('/api/pelanggan')
  if (!res.ok) throw new Error('Gagal fetch pelanggan')
  return await res.json()
})

const pelangganSlice = createSlice({
  name: 'pelanggan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPelanggan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPelanggan.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchPelanggan.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Gagal fetch pelanggan'
      })
  },
})

export default pelangganSlice.reducer 