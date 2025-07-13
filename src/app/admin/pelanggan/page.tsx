'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Zap, User, Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'
import { Badge } from '@/components/ui/badge'

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
  const [tarifList, setTarifList] = useState<any[]>([])
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [editPelanggan, setEditPelanggan] = useState(null)
  const [editForm, setEditForm] = useState({
    id_pelanggan: '',
    username: '',
    password: '',
    nama_pelanggan: '',
    alamat: '',
    nomor_kwh: '',
    id_tarif: ''
  })
  const [editFormError, setEditFormError] = useState('')
  const [tableAlert, setTableAlert] = useState('')
  const [tableAlertType, setTableAlertType] = useState<'success' | 'error' | 'warning'>('success')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePelangganId, setDeletePelangganId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleteSuccess, setDeleteSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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
    setTableAlert('')
    if (!form.username || !form.password || !form.nama_pelanggan || !form.nomor_kwh || !form.id_tarif) {
      setFormError('Semua field wajib diisi')
      return
    }
    try {
      const payload = { ...form, id_tarif: Number(form.id_tarif) }
      const res = await fetch('/api/pelanggan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        setTableAlertType('error')
        setTableAlert(data.message || data.error || 'Gagal menambah pelanggan')
        return
      }
      setTableAlertType('success')
      setTableAlert(data.message || 'Pelanggan berhasil ditambahkan!')
      setShowAddModal(false)
      setForm({ username: '', password: '', nama_pelanggan: '', alamat: '', nomor_kwh: '', id_tarif: '' })
      setFormError('')
      await fetchPelanggan()
      setTimeout(() => setTableAlert(''), 3000)
    } catch (error) {
      setTableAlertType('error')
      setTableAlert('Terjadi kesalahan koneksi')
    }
  }

  const openEditModal = (pelanggan: any) => {
    setEditPelanggan(pelanggan)
    setEditForm({
      id_pelanggan: pelanggan.id_pelanggan,
      username: pelanggan.username,
      password: '', // kosongkan, hanya isi jika ingin ganti
      nama_pelanggan: pelanggan.nama_pelanggan || '',
      alamat: pelanggan.alamat || '',
      nomor_kwh: pelanggan.nomor_kwh || '',
      id_tarif: pelanggan.tarif?.id_tarif || ''
    })
    setEditFormError('')
    setShowEditModal(true)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditPelanggan = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditFormError('')
    setTableAlert('')
    if (!editForm.username || !editForm.nama_pelanggan || !editForm.nomor_kwh || !editForm.id_tarif) {
      setEditFormError('Semua field wajib diisi')
      return
    }
    try {
      const payload: { [key: string]: any; password?: string } = {
        ...editForm,
        id_tarif: Number(editForm.id_tarif),
        id_pelanggan: Number(editForm.id_pelanggan)
      }
      if (!payload.password) delete payload.password
      const res = await fetch('/api/pelanggan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        setTableAlertType('error')
        setTableAlert(data.message || data.error || 'Gagal update pelanggan')
        return
      }
      setTableAlertType('success')
      setTableAlert(data.message || 'Pelanggan berhasil diupdate!')
      setShowEditModal(false)
      setEditPelanggan(null)
      setEditFormError('')
      await fetchPelanggan()
      setTimeout(() => setTableAlert(''), 3000)
    } catch (err) {
      setTableAlertType('error')
      setTableAlert('Terjadi kesalahan koneksi')
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
    return pelanggan.reduce((sum, item) => {
      const tarif = item.tarif?.tarifperkwh;
      return sum + (typeof tarif === 'number' && !isNaN(tarif) ? tarif : 0);
    }, 0);
  };

  const openDeleteModal = (id: number) => {
    setDeletePelangganId(id)
    setDeleteError('')
    setDeleteSuccess('')
    setShowDeleteModal(true)
  }

  const handleDeleteModalChange = (open: boolean) => {
    setShowDeleteModal(open)
    if (!open) {
      setDeleteError('')
      setDeleteSuccess('')
      setDeletePelangganId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    setDeleteError('')
    setDeleteSuccess('')
    setTableAlert('')
    try {
      const res = await fetch('/api/pelanggan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pelanggan: deletePelangganId })
      })
      const data = await res.json()
      if (!res.ok) {
        setTableAlertType('error')
        setTableAlert(data.message || data.error || 'Gagal menghapus pelanggan')
        return
      }
      setTableAlertType('success')
      setTableAlert(data.message || 'Pelanggan berhasil dihapus!')
      setDeleteError('')
      await fetchPelanggan()
      setShowDeleteModal(false)
      setTimeout(() => setTableAlert(''), 3000)
    } catch {
      setTableAlertType('error')
      setTableAlert('Terjadi kesalahan koneksi')
    }
  }

  const getAlertVariant = () => {
    if (tableAlertType === 'success') return 'success';
    if (tableAlertType === 'warning') return 'warning';
    if (tableAlertType === 'error') return 'destructive';
    return undefined;
  };

  const filteredPelanggan = pelanggan.filter(item =>
    item.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nomor_kwh.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Pelanggan</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Informasi lengkap data pelanggan listrik</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {tableAlert && (
            <div className="mb-4">
              <Alert variant={getAlertVariant()}>
                <AlertDescription>{tableAlert}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                <CardTitle className="text-sm font-medium">Rata-rata Daya</CardTitle>
                <Zap className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {getRataRataDaya()} VA
                </div>
                <p className="text-xs text-gray-500 mt-1">Daya rata-rata</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tarif</CardTitle>
                <User className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {formatCurrency(getTotalTarif())}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total tarif</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={showAddModal} onOpenChange={(open) => {
              setShowAddModal(open)
              if (!open) {
                setFormError('')
                setTableAlert('')
              }
            }}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pelanggan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Pelanggan</DialogTitle>
                  <DialogDescription>Isi data pelanggan dengan benar.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPelanggan}>
                  <div className="space-y-3">
                    {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
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

          {/* DataTable Pelanggan */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Daftar Pelanggan</CardTitle>
                  <CardDescription>
                    Informasi lengkap data pelanggan listrik
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredPelanggan.length} dari {pelanggan.length} pelanggan
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Memuat data...</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
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
                        {filteredPelanggan.map((item) => (
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
                                  onClick={() => openEditModal(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openDeleteModal(item.id_pelanggan)}
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

                  {/* Mobile Cards */}
                  <div className="lg:hidden">
                    {filteredPelanggan.map((item) => (
                      <div key={item.id_pelanggan} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.nama_pelanggan}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.alamat}</p>
                            <p className="text-sm text-gray-500 mt-1">No. KWH: {item.nomor_kwh}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDeleteModal(item.id_pelanggan)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {item.tarif?.daya ? `${item.tarif.daya} VA` : 'N/A'}
                          </Badge>
                          <Badge variant="outline">
                            {formatCurrency(item.tarif?.tarifperkwh)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal Edit Pelanggan */}
          <Dialog open={showEditModal} onOpenChange={(open) => {
            setShowEditModal(open)
            if (!open) {
              setEditFormError('')
              setTableAlert('')
            }
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Pelanggan</DialogTitle>
                <DialogDescription>Edit data pelanggan sesuai kebutuhan.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditPelanggan}>
                <div className="space-y-3">
                  {editFormError && <Alert variant="destructive"><AlertDescription>{editFormError}</AlertDescription></Alert>}
                  <Input name="username" placeholder="Username" value={editForm.username} onChange={handleEditFormChange} required />
                  <Input name="password" type="password" placeholder="Password (isi jika ingin ganti)" value={editForm.password} onChange={handleEditFormChange} />
                  <Input name="nama_pelanggan" placeholder="Nama Pelanggan" value={editForm.nama_pelanggan} onChange={handleEditFormChange} required />
                  <Input name="alamat" placeholder="Alamat" value={editForm.alamat} onChange={handleEditFormChange} />
                  <Input name="nomor_kwh" placeholder="Nomor KWH" value={editForm.nomor_kwh} onChange={handleEditFormChange} required />
                  <select name="id_tarif" value={editForm.id_tarif} onChange={handleEditFormChange} required className="w-full border rounded p-2">
                    <option value="">Pilih Daya & Tarif</option>
                    {tarifList.map((t) => (
                      <option key={t.id_tarif} value={t.id_tarif}>{t.daya} VA - Rp {Number(t.tarifperkwh).toLocaleString('id-ID')}</option>
                    ))}
                  </select>
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

          {/* Modal Konfirmasi Hapus */}
          <Dialog open={showDeleteModal} onOpenChange={handleDeleteModalChange}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Pelanggan</DialogTitle>
                <DialogDescription>Konfirmasi penghapusan pelanggan. Tindakan ini tidak dapat dibatalkan.</DialogDescription>
              </DialogHeader>
              <div className="mb-4">Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.</div>
              {deleteError && !deleteSuccess && (
                <Alert variant="destructive"><AlertDescription>{deleteError}</AlertDescription></Alert>
              )}
              {deleteSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800"><AlertDescription>{deleteSuccess}</AlertDescription></Alert>
              )}
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteConfirm}>Hapus</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
} 