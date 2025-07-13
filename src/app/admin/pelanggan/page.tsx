'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Zap, User, Plus, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'

interface Pelanggan {
  id_pelanggan: number
  nama_pelanggan: string
  alamat: string
  nomor_kwh: string
  tarif: {
    daya: number
    tarifperkwh: number
  } | null
}

export default function PelangganPage() {
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false)
  const [tarifList, setTarifList] = useState([])
  const [form, setForm] = useState({
    username: '',
    password: '',
    nama_pelanggan: '',
    alamat: '',
    nomor_kwh: '',
    id_tarif: ''
  })
  const [formError, setFormError] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    fetchPelanggan()
    fetchTarif()
  }, [])

  const fetchPelanggan = async () => {
    try {
      const response = await fetch('/api/pelanggan')
      if (response.ok) {
        const data = await response.json()
        setPelanggan(data)
      }
    } catch (error) {
      console.error('Error fetching pelanggan:', error)
      setError('Gagal memuat data pelanggan')
    } finally {
      setLoading(false)
    }
  }

  const fetchTarif = async () => {
    try {
      const res = await fetch('/api/tarif')
      if (res.ok) {
        const data = await res.json()
        setTarifList(data)
      }
    } catch {}
  }

  const handleDelete = async (id_pelanggan: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) return

    try {
      const response = await fetch('/api/pelanggan', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_pelanggan }),
      })

      if (response.ok) {
        fetchPelanggan()
      } else {
        setError('Gagal menghapus pelanggan')
      }
    } catch (error) {
      console.error('Error deleting pelanggan:', error)
      setError('Terjadi kesalahan koneksi')
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddPelanggan = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    // Validasi sederhana
    if (!form.username || !form.password || !form.nama_pelanggan || !form.nomor_kwh || !form.id_tarif) {
      setFormError('Semua field wajib diisi')
      return
    }
    try {
      // Pastikan id_tarif dikirim sebagai integer
      const payload = { ...form, id_tarif: Number(form.id_tarif) }
      const res = await fetch('/api/pelanggan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || 'Gagal menambah pelanggan')
        return
      }
      setShowAddModal(false)
      setForm({ username: '', password: '', nama_pelanggan: '', alamat: '', nomor_kwh: '', id_tarif: '' })
      dispatch(fetchPelanggan())
    } catch {
      setFormError('Terjadi kesalahan koneksi')
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

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const getRataRataDaya = () => {
    if (pelanggan.length === 0) return 0
    const totalDaya = pelanggan.reduce((sum, item) => sum + (item.tarif?.daya || 0), 0)
    return Math.round(totalDaya / pelanggan.length)
  }

  const getTotalTarif = () => {
    return pelanggan.reduce((sum, item) => sum + (item.tarif?.tarifperkwh || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Data Pelanggan</h1>
            <p className="text-gray-600 mt-2">Informasi lengkap data pelanggan listrik</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <CardTitle className="text-sm font-medium">Rata-rata Daya</CardTitle>
                <Zap className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {getRataRataDaya()} VA
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tarif</CardTitle>
                <User className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(getTotalTarif())}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DataTable Pelanggan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Daftar Pelanggan</CardTitle>
                  <CardDescription>
                    Informasi lengkap data pelanggan listrik
                  </CardDescription>
                </div>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Pelanggan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Pelanggan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPelanggan}>
                      <div className="space-y-3">
                        <Input name="username" placeholder="Username" value={form.username} onChange={handleFormChange} required />
                        <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleFormChange} required />
                        <Input name="nama_pelanggan" placeholder="Nama Pelanggan" value={form.nama_pelanggan} onChange={handleFormChange} required />
                        <Input name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleFormChange} />
                        <Input name="nomor_kwh" placeholder="Nomor KWH" value={form.nomor_kwh} onChange={handleFormChange} required />
                        <select name="id_tarif" value={form.id_tarif} onChange={handleFormChange} required className="w-full border rounded p-2">
                          <option value="">Pilih Daya & Tarif</option>
                          {tarifList.map((t) => (
                            <option key={t.id_tarif} value={t.id_tarif}>{t.daya} VA - Rp {Number(t.tarifperkwh).toLocaleString('id-ID')}</option>
                          ))}
                        </select>
                        {formError && <div className="text-red-600 text-sm">{formError}</div>}
                      </div>
                      <DialogFooter className="mt-4">
                        <Button type="submit">Simpan</Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Batal</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                        <TableHead className="font-semibold">Nama Pelanggan</TableHead>
                        <TableHead className="font-semibold">Alamat</TableHead>
                        <TableHead className="font-semibold">No. KWH</TableHead>
                        <TableHead className="font-semibold">Daya</TableHead>
                        <TableHead className="font-semibold">Tarif/KWH</TableHead>
                        <TableHead className="font-semibold">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pelanggan.map((item) => (
                        <TableRow key={item.id_pelanggan} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {item.nama_pelanggan}
                          </TableCell>
                          <TableCell>{item.alamat}</TableCell>
                          <TableCell>{item.nomor_kwh}</TableCell>
                          <TableCell>
                            {item.tarif?.daya ? `${item.tarif.daya} VA` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.tarif?.tarifperkwh)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/admin/pelanggan/edit/${item.id_pelanggan}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(item.id_pelanggan)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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