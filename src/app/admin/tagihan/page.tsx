'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, DollarSign, CheckCircle, XCircle, Edit, Trash2, Plus } from 'lucide-react'

interface Tagihan {
  id_tagihan: number
  id_penggunaan: number
  id_pelanggan: number
  bulan: string
  tahun: number
  jumlah_meter: number
  status: string
  pelanggan?: {
    nama_pelanggan: string
  }
}

export default function TagihanPage() {
  const [tagihan, setTagihan] = useState<Tagihan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTagihan()
  }, [])

  const fetchTagihan = async () => {
    try {
      const response = await fetch('/api/tagihan')
      if (response.ok) {
        const data = await response.json()
        setTagihan(data)
      }
    } catch (error) {
      console.error('Error fetching tagihan:', error)
      setError('Gagal memuat data tagihan')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id_tagihan: number, newStatus: string) => {
    try {
      const response = await fetch('/api/tagihan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_tagihan,
          status: newStatus
        }),
      })

      if (response.ok) {
        // Refresh data
        fetchTagihan()
      } else {
        setError('Gagal mengupdate status tagihan')
      }
    } catch (error) {
      console.error('Error updating tagihan:', error)
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

  const getTagihanLunas = () => {
    return tagihan.filter(item => item.status === 'sudah_bayar').length
  }

  const getTagihanBelumLunas = () => {
    return tagihan.filter(item => item.status === 'belum_bayar').length
  }

  const getTotalTagihan = () => {
    return tagihan.reduce((sum, item) => sum + item.jumlah_meter, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Tagihan</h1>
            <p className="text-gray-600 mt-2">Kelola status pembayaran tagihan listrik</p>
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
                <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{tagihan.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sudah Lunas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{getTagihanLunas()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{getTagihanBelumLunas()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total KWH</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{getTotalTagihan().toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tagihan Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Daftar Tagihan</CardTitle>
                  <CardDescription>
                    Kelola status pembayaran tagihan listrik
                  </CardDescription>
                </div>
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
                        <TableHead className="font-semibold">Jumlah Meter</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tagihan.map((item) => (
                        <TableRow key={item.id_tagihan} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {item.pelanggan?.nama_pelanggan || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {item.bulan} {item.tahun}
                          </TableCell>
                          <TableCell>{item.jumlah_meter.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={item.status === 'sudah_bayar' ? 'default' : 'secondary'}
                              className="font-medium"
                            >
                              {item.status === 'sudah_bayar' ? 'Lunas' : 'Belum Lunas'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {item.status === 'belum_bayar' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(item.id_tagihan, 'sudah_bayar')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Lunas
                                </Button>
                              )}
                              {item.status === 'sudah_bayar' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(item.id_tagihan, 'belum_bayar')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Belum Lunas
                                </Button>
                              )}
                            </div>
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