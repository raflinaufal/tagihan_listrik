'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BarChart2, Zap, Plus, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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

interface Pelanggan {
  id_pelanggan: number
  nama_pelanggan: string
}

export default function PenggunaanPage() {
  const [penggunaan, setPenggunaan] = useState<Penggunaan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false)
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([])
  const [form, setForm] = useState({
    id_pelanggan: '',
    bulan: '',
    tahun: '',
    meter_awal: '',
    meter_ahir: ''
  })
  const [formError, setFormError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editPenggunaan, setEditPenggunaan] = useState<Penggunaan | null>(null)
  const [editForm, setEditForm] = useState({
    id_penggunaan: '',
    id_pelanggan: '',
    bulan: '',
    tahun: '',
    meter_awal: '',
    meter_ahir: ''
  })
  const [editFormError, setEditFormError] = useState('')
  const [tableAlert, setTableAlert] = useState('')
  const [tableAlertType, setTableAlertType] = useState<'success' | 'error' | 'warning'>('success')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePenggunaanId, setDeletePenggunaanId] = useState<number | null>(null)

  useEffect(() => {
    fetchPenggunaan()
    fetchPelanggan()
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

  const fetchPelanggan = async () => {
    try {
      const response = await fetch('/api/pelanggan')
      if (response.ok) {
        const data = await response.json()
        setPelangganList(data)
      }
    } catch (error) {
      console.error('Error fetching pelanggan:', error)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddPenggunaan = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setTableAlert('')
    
    if (!form.id_pelanggan || !form.bulan || !form.tahun || !form.meter_awal || !form.meter_ahir) {
      setFormError('Semua field wajib diisi')
      return
    }

    if (Number(form.meter_ahir) <= Number(form.meter_awal)) {
      setFormError('Meter akhir harus lebih besar dari meter awal')
      return
    }

    try {
      const payload = {
        ...form,
        id_pelanggan: Number(form.id_pelanggan),
        tahun: Number(form.tahun),
        meter_awal: Number(form.meter_awal),
        meter_ahir: Number(form.meter_ahir)
      }
      
      const res = await fetch('/api/penggunaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setTableAlertType('error')
        setTableAlert(data.message || data.error || 'Gagal menambah penggunaan')
        return
      }
      
      setTableAlertType('success')
      setTableAlert(data.message || 'Penggunaan berhasil ditambahkan!')
      setShowAddModal(false)
      setForm({ id_pelanggan: '', bulan: '', tahun: '', meter_awal: '', meter_ahir: '' })
      setFormError('')
      await fetchPenggunaan()
      setTimeout(() => setTableAlert(''), 3000)
    } catch (error) {
      setTableAlertType('error')
      setTableAlert('Terjadi kesalahan koneksi')
    }
  }

  const openEditModal = (penggunaan: Penggunaan) => {
    setEditPenggunaan(penggunaan)
    setEditForm({
      id_penggunaan: penggunaan.id_penggunaan.toString(),
      id_pelanggan: penggunaan.id_pelanggan.toString(),
      bulan: penggunaan.bulan,
      tahun: penggunaan.tahun.toString(),
      meter_awal: penggunaan.meter_awal.toString(),
      meter_ahir: penggunaan.meter_ahir.toString()
    })
    setEditFormError('')
    setShowEditModal(true)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditPenggunaan = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditFormError('')
    setTableAlert('')
    
    if (!editForm.id_pelanggan || !editForm.bulan || !editForm.tahun || !editForm.meter_awal || !editForm.meter_ahir) {
      setEditFormError('Semua field wajib diisi')
      return
    }

    if (Number(editForm.meter_ahir) <= Number(editForm.meter_awal)) {
      setEditFormError('Meter akhir harus lebih besar dari meter awal')
      return
    }

    try {
      const payload = {
        ...editForm,
        id_pelanggan: Number(editForm.id_pelanggan),
        id_penggunaan: Number(editForm.id_penggunaan),
        tahun: Number(editForm.tahun),
        meter_awal: Number(editForm.meter_awal),
        meter_ahir: Number(editForm.meter_ahir)
      }
      
      const res = await fetch('/api/penggunaan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setTableAlertType('error')
        setTableAlert(data.message || data.error || 'Gagal update penggunaan')
        return
      }
      
      setTableAlertType('success')
      setTableAlert(data.message || 'Penggunaan berhasil diupdate!')
      setShowEditModal(false)
      setEditPenggunaan(null)
      setEditFormError('')
      await fetchPenggunaan()
      setTimeout(() => setTableAlert(''), 3000)
    } catch (error) {
      setTableAlertType('error')
      setTableAlert('Terjadi kesalahan koneksi')
    }
  }

  const openDeleteModal = (id: number) => {
    setDeletePenggunaanId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteModalChange = (open: boolean) => {
    setShowDeleteModal(open)
    if (!open) {
      setDeletePenggunaanId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    setTableAlert('')
    
    try {
      const res = await fetch('/api/penggunaan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_penggunaan: deletePenggunaanId })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setTableAlertType('error')
        setTableAlert(data.message || data.error || 'Gagal menghapus penggunaan')
        return
      }
      
      setTableAlertType('success')
      setTableAlert(data.message || 'Penggunaan berhasil dihapus!')
      await fetchPenggunaan()
      setShowDeleteModal(false)
      setTimeout(() => setTableAlert(''), 3000)
    } catch (error) {
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

  const getAlertVariant = () => {
    if (tableAlertType === 'success') return 'success';
    if (tableAlertType === 'warning') return 'warning';
    if (tableAlertType === 'error') return 'destructive';
    return undefined;
  };

  const bulanOptions = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

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

          {tableAlert && (
            <div className="mb-4">
              <Alert variant={getAlertVariant()}>
                <AlertDescription>{tableAlert}</AlertDescription>
              </Alert>
            </div>
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
                <Dialog open={showAddModal} onOpenChange={(open) => {
                  setShowAddModal(open)
                  if (!open) {
                    setFormError('')
                    setTableAlert('')
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Penggunaan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Penggunaan</DialogTitle>
                      <DialogDescription>Isi data penggunaan dengan benar.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPenggunaan}>
                      <div className="space-y-3">
                        {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
                        <select name="id_pelanggan" value={form.id_pelanggan} onChange={handleFormChange} required className="w-full border rounded p-2">
                          <option value="">Pilih Pelanggan</option>
                          {pelangganList.map((p) => (
                            <option key={p.id_pelanggan} value={p.id_pelanggan}>{p.nama_pelanggan}</option>
                          ))}
                        </select>
                        <select name="bulan" value={form.bulan} onChange={handleFormChange} required className="w-full border rounded p-2">
                          <option value="">Pilih Bulan</option>
                          {bulanOptions.map((bulan, index) => (
                            <option key={index} value={bulan}>{bulan}</option>
                          ))}
                        </select>
                        <Input name="tahun" type="number" placeholder="Tahun" value={form.tahun} onChange={handleFormChange} required />
                        <Input name="meter_awal" type="number" placeholder="Meter Awal" value={form.meter_awal} onChange={handleFormChange} required />
                        <Input name="meter_ahir" type="number" placeholder="Meter Akhir" value={form.meter_ahir} onChange={handleFormChange} required />
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
                                  onClick={() => openEditModal(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openDeleteModal(item.id_penggunaan)}
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

          {/* Modal Edit Penggunaan */}
          <Dialog open={showEditModal} onOpenChange={(open) => {
            setShowEditModal(open)
            if (!open) {
              setEditFormError('')
              setTableAlert('')
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Penggunaan</DialogTitle>
                <DialogDescription>Edit data penggunaan sesuai kebutuhan.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditPenggunaan}>
                <div className="space-y-3">
                  {editFormError && <Alert variant="destructive"><AlertDescription>{editFormError}</AlertDescription></Alert>}
                  <select name="id_pelanggan" value={editForm.id_pelanggan} onChange={handleEditFormChange} required className="w-full border rounded p-2">
                    <option value="">Pilih Pelanggan</option>
                    {pelangganList.map((p) => (
                      <option key={p.id_pelanggan} value={p.id_pelanggan}>{p.nama_pelanggan}</option>
                    ))}
                  </select>
                  <select name="bulan" value={editForm.bulan} onChange={handleEditFormChange} required className="w-full border rounded p-2">
                    <option value="">Pilih Bulan</option>
                    {bulanOptions.map((bulan, index) => (
                      <option key={index} value={bulan}>{bulan}</option>
                    ))}
                  </select>
                  <Input name="tahun" type="number" placeholder="Tahun" value={editForm.tahun} onChange={handleEditFormChange} required />
                  <Input name="meter_awal" type="number" placeholder="Meter Awal" value={editForm.meter_awal} onChange={handleEditFormChange} required />
                  <Input name="meter_ahir" type="number" placeholder="Meter Akhir" value={editForm.meter_ahir} onChange={handleEditFormChange} required />
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
                <DialogTitle>Hapus Penggunaan</DialogTitle>
                <DialogDescription>Konfirmasi penghapusan data penggunaan. Tindakan ini tidak dapat dibatalkan.</DialogDescription>
              </DialogHeader>
              <div className="mb-4">Apakah Anda yakin ingin menghapus data penggunaan ini? Tindakan ini tidak dapat dibatalkan.</div>
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