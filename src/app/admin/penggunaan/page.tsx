'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BarChart2, Zap, Plus, Edit, Trash2 } from 'lucide-react'

interface Penggunaan {
  id_penggunaan: number
  id_pelanggan: number
  bulan: string
  tahun: number
  meter_awal: number
  meter_ahir: number
  pelanggan?: {
    nama_pelanggan: string
    tarif?: {
      tarifperkwh: number
    }
  }
}

export default function PenggunaanPage() {
  const [penggunaan, setPenggunaan] = useState<Penggunaan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPenggunaan()
  }, [])

  const fetchPenggunaan = async () => {
    try {
      const response = await fetch('/api/penggunaan')
      if (response.ok) {
        const data = await response.json()
        setPenggunaan(data)
      }
    } catch (error) {
      console.error('Error fetching penggunaan:', error)
      setError('Gagal memuat data penggunaan')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id_penggunaan: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    try {
      const response = await fetch('/api/penggunaan', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_penggunaan }),
      })

      if (response.ok) {
        fetchPenggunaan()
      } else {
        setError('Gagal menghapus data penggunaan')
      }
    } catch (error) {
      console.error('Error deleting penggunaan:', error)
      setError('Terjadi kesalahan koneksi')
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

  const getTotalKwh = () => {
    return penggunaan.reduce((sum, item) => sum + (item.meter_ahir - item.meter_awal), 0)
  }

  const getTotalTagihan = () => {
    return penggunaan.reduce((sum, item) => {
      const kwh = item.meter_ahir - item.meter_awal
      const tarif = item.pelanggan?.tarif?.tarifperkwh || 0
      return sum + (kwh * tarif)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Penggunaan</h1>
            <p className="text-gray-600 mt-2">Kelola data penggunaan listrik pelanggan</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Penggunaan</CardTitle>
                <BarChart2 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{penggunaan.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total KWH</CardTitle>
                <Zap className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{getTotalKwh().toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
                <BarChart2 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalTagihan())}</div>
              </CardContent>
            </Card>
          </div>

          {/* Penggunaan Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Daftar Penggunaan</CardTitle>
                  <CardDescription>
                    Data penggunaan listrik per pelanggan
                  </CardDescription>
                </div>
                <Button onClick={() => router.push('/admin/penggunaan/tambah')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Penggunaan
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
                        <TableHead className="font-semibold">Meter Awal</TableHead>
                        <TableHead className="font-semibold">Meter Akhir</TableHead>
                        <TableHead className="font-semibold">Total KWH</TableHead>
                        <TableHead className="font-semibold">Tarif/KWH</TableHead>
                        <TableHead className="font-semibold">Total Tagihan</TableHead>
                        <TableHead className="font-semibold">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {penggunaan.map((item) => {
                        const totalKwh = item.meter_ahir - item.meter_awal
                        const tarifPerKwh = item.pelanggan?.tarif?.tarifperkwh || 0
                        const totalTagihan = totalKwh * tarifPerKwh

                        return (
                          <TableRow key={item.id_penggunaan} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              {item.pelanggan?.nama_pelanggan || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {item.bulan} {item.tahun}
                            </TableCell>
                            <TableCell>{item.meter_awal.toLocaleString()}</TableCell>
                            <TableCell>{item.meter_ahir.toLocaleString()}</TableCell>
                            <TableCell className="font-medium text-blue-600">
                              {totalKwh.toLocaleString()}
                            </TableCell>
                            <TableCell>{formatCurrency(tarifPerKwh)}</TableCell>
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(totalTagihan)}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/admin/penggunaan/edit/${item.id_penggunaan}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(item.id_penggunaan)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
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