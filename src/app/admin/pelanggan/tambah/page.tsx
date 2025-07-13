'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Plus, Users } from 'lucide-react'
import Link from 'next/link'

interface Tarif {
  id_tarif: number
  daya: number
  tarifperkwh: number
}

export default function TambahPelangganPage() {
  const [tarif, setTarif] = useState<Tarif[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_pelanggan: '',
    alamat: '',
    nomor_kwh: '',
    id_tarif: ''
  })

  useEffect(() => {
    fetchTarif()
  }, [])

  const fetchTarif = async () => {
    try {
      const response = await fetch('/api/tarif')
      if (response.ok) {
        const data = await response.json()
        setTarif(data)
      }
    } catch (error) {
      console.error('Error fetching tarif:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/pelanggan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Gagal menambah pelanggan')
        return
      }

      setSuccess('Pelanggan berhasil ditambahkan!')
      setTimeout(() => {
        router.push('/admin/pelanggan')
      }, 2000)
    } catch (error) {
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Link href="/admin/pelanggan">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tambah Pelanggan
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Form Tambah Pelanggan</CardTitle>
            <CardDescription>
              Masukkan data pelanggan baru
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Masukkan username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama_pelanggan" className="text-sm font-medium">
                    Nama Pelanggan
                  </Label>
                  <Input
                    id="nama_pelanggan"
                    name="nama_pelanggan"
                    type="text"
                    value={formData.nama_pelanggan}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama pelanggan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomor_kwh" className="text-sm font-medium">
                    Nomor KWH
                  </Label>
                  <Input
                    id="nomor_kwh"
                    name="nomor_kwh"
                    type="text"
                    value={formData.nomor_kwh}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor KWH"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat" className="text-sm font-medium">
                    Alamat
                  </Label>
                  <Input
                    id="alamat"
                    name="alamat"
                    type="text"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_tarif" className="text-sm font-medium">
                    Tarif Listrik
                  </Label>
                  <select
                    id="id_tarif"
                    name="id_tarif"
                    value={formData.id_tarif}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Tarif</option>
                    {tarif.map((item) => (
                      <option key={item.id_tarif} value={item.id_tarif}>
                        {item.daya} VA - Rp {item.tarifperkwh.toLocaleString()}/KWH
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/admin/pelanggan">
                  <Button variant="outline" type="button">
                    Batal
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Simpan Pelanggan</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 