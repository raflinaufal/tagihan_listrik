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
import { Users, Zap, FileText, DollarSign } from 'lucide-react'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Statistik utama sistem pembayaran listrik</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{pelanggan.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Penggunaan</CardTitle>
                <Zap className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{penggunaan.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{tagihan.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tagihan Lunas</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{getTagihanLunas()}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {getTagihanBelumLunas()} belum lunas
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/pelanggan')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Manajemen Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Kelola data pelanggan listrik</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/tagihan')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Manajemen Tagihan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Kelola status pembayaran tagihan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 