import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Tagihan {
  id_tagihan: number
  id_penggunaan: number
  id_pelanggan: number
  bulan: string
  tahun: number
  jumlah_meter: number
  status: string
}

interface TagihanState {
  data: Tagihan[]
  loading: boolean
  error: string | null
}

const initialState: TagihanState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchTagihan = createAsyncThunk('tagihan/fetch', async () => {
  const res = await fetch('/api/tagihan')
  if (!res.ok) throw new Error('Gagal fetch tagihan')
  return await res.json()
})

const tagihanSlice = createSlice({
  name: 'tagihan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagihan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTagihan.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchTagihan.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Gagal fetch tagihan'
      })
  },
})

export default tagihanSlice.reducer 