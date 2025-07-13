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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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
  const [showBayarModal, setShowBayarModal] = useState(false)
  const [bayarForm, setBayarForm] = useState({ tanggal_bayar: '', biaya_admin: '', total_bayar: '', id_tagihan: 0, id_pelanggan: 0 })
  const [bayarError, setBayarError] = useState('')
  const [bayarSuccess, setBayarSuccess] = useState('')

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

  // Hitung total bayar (jumlah_meter * tarifperkwh + biaya_admin)
  // Asumsi tarifperkwh diambil dari API penggunaan atau tarif, di sini dummy 1500
  const getTotalBayar = (jumlah_meter: number, biaya_admin: string) => {
    const tarifperkwh = 1500 // TODO: replace with real value if available
    return jumlah_meter * tarifperkwh + Number(biaya_admin || 0)
  }

  const openBayarModal = (item: Tagihan) => {
    setBayarForm({
      tanggal_bayar: new Date().toISOString().slice(0, 10),
      biaya_admin: '',
      total_bayar: getTotalBayar(item.jumlah_meter, '').toString(),
      id_tagihan: item.id_tagihan,
      id_pelanggan: item.id_pelanggan
    })
    setBayarError('')
    setBayarSuccess('')
    setShowBayarModal(true)
  }

  const handleBayarFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let newForm = { ...bayarForm, [name]: value }
    if (name === 'biaya_admin') {
      newForm.total_bayar = getTotalBayar(
        tagihan.find(t => t.id_tagihan === bayarForm.id_tagihan)?.jumlah_meter || 0,
        value
      ).toString()
    }
    setBayarForm(newForm)
  }

  const handleProsesBayar = async (e: React.FormEvent) => {
    e.preventDefault()
    setBayarError('')
    setBayarSuccess('')
    if (!bayarForm.tanggal_bayar || !bayarForm.total_bayar) {
      setBayarError('Tanggal bayar dan total bayar wajib diisi')
      return
    }
    try {
      // 1. Insert pembayaran
      const res = await fetch('/api/pembayaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_tagihan: bayarForm.id_tagihan,
          id_pelanggan: bayarForm.id_pelanggan,
          tanggal_pembayaran: new Date(bayarForm.tanggal_bayar).toISOString(),
          biaya_admin: Number(bayarForm.biaya_admin || 0),
          total_bayar: Number(bayarForm.total_bayar)
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setBayarError(data.message || data.error || 'Gagal memproses pembayaran')
        return
      }
      // 2. Update status tagihan
      await fetch('/api/tagihan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tagihan: bayarForm.id_tagihan, status: 'sudah_bayar' })
      })
      setBayarSuccess('Pembayaran berhasil!')
      setShowBayarModal(false)
      fetchTagihan()
    } catch (err) {
      setBayarError('Terjadi kesalahan koneksi')
    }
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
                                <Dialog open={showBayarModal} onOpenChange={setShowBayarModal}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openBayarModal(item)}>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Bayar
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Proses Pembayaran</DialogTitle>
                                      <DialogDescription>Isi data pembayaran di bawah ini.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleProsesBayar}>
                                      <div className="space-y-3">
                                        {bayarError && <Alert variant="destructive"><AlertDescription>{bayarError}</AlertDescription></Alert>}
                                        <label htmlFor="tanggal_bayar" className="block text-sm font-medium mb-1">Tanggal Bayar</label>
                                        <Input id="tanggal_bayar" name="tanggal_bayar" type="date" value={bayarForm.tanggal_bayar} onChange={handleBayarFormChange} required />
                                        <label htmlFor="biaya_admin" className="block text-sm font-medium mb-1">Biaya Admin</label>
                                        <Input id="biaya_admin" name="biaya_admin" type="number" placeholder="0" value={bayarForm.biaya_admin} onChange={handleBayarFormChange} />
                                        <label htmlFor="total_bayar" className="block text-sm font-medium mb-1">Total Bayar</label>
                                        <Input id="total_bayar" name="total_bayar" type="number" value={bayarForm.total_bayar} readOnly />
                                      </div>
                                      <DialogFooter className="mt-4">
                                        <Button type="submit">Proses Pembayaran</Button>
                                        <DialogClose asChild>
                                          <Button type="button" variant="outline">Batal</Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              )}
                              {item.status === 'sudah_bayar' && (
                                <Badge variant="default">Lunas</Badge>
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