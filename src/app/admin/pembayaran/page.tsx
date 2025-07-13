'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DollarSign, CreditCard, Calendar, User, Plus } from 'lucide-react'

interface Pembayaran {
  id_pembayaran: number
  id_tagihan: number
  id_pelanggan: number
  tanggal_pembayaran: string
  bulan_bayar: string
  biaya_admin: number
  total_bayar: number
  id_user: number
  pelanggan?: {
    nama_pelanggan: string
  }
  tagihan?: {
    bulan: string
    tahun: number
  }
}

export default function PembayaranPage() {
  const [pembayaran, setPembayaran] = useState<Pembayaran[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPembayaran()
  }, [])

  const fetchPembayaran = async () => {
    try {
      const response = await fetch('/api/pembayaran')
      if (response.ok) {
        const data = await response.json()
        setPembayaran(data)
      }
    } catch (error) {
      console.error('Error fetching pembayaran:', error)
      setError('Gagal memuat data pembayaran')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalPendapatan = () => {
    return pembayaran.reduce((sum, item) => sum + (item.total_bayar || 0), 0)
  }

  const getTotalBiayaAdmin = () => {
    return pembayaran.reduce((sum, item) => sum + (item.biaya_admin || 0), 0)
  }

  const getPembayaranHariIni = () => {
    const today = new Date().toDateString()
    return pembayaran.filter(item => 
      new Date(item.tanggal_pembayaran).toDateString() === today
    ).length
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Pembayaran</h1>
            <p className="text-gray-600 mt-2">Kelola data pembayaran tagihan listrik</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pembayaran</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{pembayaran.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalPendapatan())}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Biaya Admin</CardTitle>
                <User className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalBiayaAdmin())}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{getPembayaranHariIni()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Pembayaran Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Daftar Pembayaran</CardTitle>
                  <CardDescription>
                    Riwayat pembayaran tagihan listrik
                  </CardDescription>
                </div>
                <Button onClick={() => router.push('/admin/tagihan')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Lihat Tagihan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Pelanggan</TableHead>
                        <TableHead className="font-semibold">Periode</TableHead>
                        <TableHead className="font-semibold">Tanggal Bayar</TableHead>
                        <TableHead className="font-semibold">Biaya Admin</TableHead>
                        <TableHead className="font-semibold">Total Bayar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pembayaran.map((item) => (
                        <TableRow key={item.id_pembayaran} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {item.pelanggan?.nama_pelanggan || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {item.tagihan?.bulan} {item.tagihan?.tahun}
                          </TableCell>
                          <TableCell>
                            {item.tanggal_pembayaran ? formatDate(item.tanggal_pembayaran) : 'N/A'}
                          </TableCell>
                          <TableCell>{formatCurrency(item.biaya_admin || 0)}</TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatCurrency(item.total_bayar || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 