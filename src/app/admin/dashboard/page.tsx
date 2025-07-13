'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { fetchPelanggan } from '@/store/pelangganSlice'
import { fetchPenggunaan } from '@/store/penggunaanSlice'
import { fetchTagihan } from '@/store/tagihanSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Zap, FileText, DollarSign, TrendingUp, AlertCircle, CreditCard } from 'lucide-react'

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const pelanggan = useSelector((state: RootState) => state.pelanggan.data)
  const penggunaan = useSelector((state: RootState) => state.penggunaan.data)
  const tagihan = useSelector((state: RootState) => state.tagihan.data)
  const loading = useSelector((state: RootState) => state.pelanggan.loading || state.penggunaan.loading || state.tagihan.loading)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchPelanggan())
    dispatch(fetchPenggunaan())
    dispatch(fetchTagihan())
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getTagihanLunas = () => {
    return tagihan.filter(item => item.status === 'sudah_bayar').length
  }

  const getTagihanBelumLunas = () => {
    return tagihan.filter(item => item.status === 'belum_bayar').length
  }

  const getTotalRevenue = () => {
    return tagihan
      .filter(item => item.status === 'sudah_bayar')
      .reduce((sum, item) => sum + (item.jumlah_meter * 1500), 0) // Assuming 1500 per kWh
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        {/* Mobile Header Spacer */}
        <div className="lg:hidden h-16"></div>
        
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Statistik utama sistem pembayaran listrik</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{pelanggan.length}</div>
                <p className="text-xs text-gray-500 mt-1">Pelanggan terdaftar</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Penggunaan</CardTitle>
                <Zap className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{penggunaan.length}</div>
                <p className="text-xs text-gray-500 mt-1">Data penggunaan</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{tagihan.length}</div>
                <p className="text-xs text-gray-500 mt-1">Tagihan dibuat</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tagihan Lunas</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{getTagihanLunas()}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {getTagihanBelumLunas()} belum lunas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Pendapatan Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  Rp {getTotalRevenue().toLocaleString('id-ID')}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total pendapatan dari tagihan yang sudah dibayar
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Tagihan Tertunda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {getTagihanBelumLunas()}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Tagihan yang belum dibayar
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-blue-200" 
              onClick={() => router.push('/admin/pelanggan')}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Manajemen Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Kelola data pelanggan listrik</p>
                <div className="mt-3 text-xs text-blue-600 group-hover:text-blue-700">
                  Lihat detail →
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-purple-200" 
              onClick={() => router.push('/admin/tagihan')}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Manajemen Tagihan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Kelola status pembayaran tagihan</p>
                <div className="mt-3 text-xs text-purple-600 group-hover:text-purple-700">
                  Lihat detail →
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-green-200" 
              onClick={() => router.push('/admin/pembayaran')}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Manajemen Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Kelola data pembayaran</p>
                <div className="mt-3 text-xs text-green-600 group-hover:text-green-700">
                  Lihat detail →
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 