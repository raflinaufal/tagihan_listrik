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

interface Pelanggan {
  id_pelanggan: number
  nama_pelanggan: string
  alamat: string
  tarif: {
    daya: number
    tarifperkwh: number
  } | null
}

export default function TambahPenggunaanPage() {
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    pelanggan_id: '',
    bulan: '',
    tahun: '',
    meter_awal: '',
    meter_akhir: ''
  })

  useEffect(() => {
    fetchPelanggan()
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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/penggunaan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Gagal menambah data')
        return
      }

      setSuccess('Data penggunaan berhasil ditambahkan!')
      setTimeout(() => {
        router.push('/admin/dashboard')
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

  const getBulanOptions = () => {
    const bulanNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    return bulanNames.map((nama, index) => ({
      value: (index + 1).toString(),
      label: nama
    }))
  }

  const getTahunOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i)
    }
    return years
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Link href="/admin/dashboard">
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
                  Tambah Data Penggunaan
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
            <CardTitle className="text-xl">Form Penggunaan Listrik</CardTitle>
            <CardDescription>
              Masukkan data penggunaan listrik untuk pelanggan
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
                  <Label htmlFor="pelanggan_id" className="text-sm font-medium">
                    Pelanggan
                  </Label>
                  <select
                    id="pelanggan_id"
                    name="pelanggan_id"
                    value={formData.pelanggan_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Pelanggan</option>
                    {pelanggan.map((item) => (
                      <option key={item.id_pelanggan} value={item.id_pelanggan}>
                        {item.nama_pelanggan} - {item.alamat} (Daya: {item.tarif?.daya || 'N/A'} VA)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulan" className="text-sm font-medium">
                    Bulan
                  </Label>
                  <select
                    id="bulan"
                    name="bulan"
                    value={formData.bulan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Bulan</option>
                    {getBulanOptions().map((bulan) => (
                      <option key={bulan.value} value={bulan.value}>
                        {bulan.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tahun" className="text-sm font-medium">
                    Tahun
                  </Label>
                  <select
                    id="tahun"
                    name="tahun"
                    value={formData.tahun}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Tahun</option>
                    {getTahunOptions().map((tahun) => (
                      <option key={tahun} value={tahun}>
                        {tahun}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meter_awal" className="text-sm font-medium">
                    Meter Awal
                  </Label>
                  <Input
                    id="meter_awal"
                    name="meter_awal"
                    type="number"
                    step="0.01"
                    value={formData.meter_awal}
                    onChange={handleInputChange}
                    placeholder="Masukkan meter awal"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meter_akhir" className="text-sm font-medium">
                    Meter Akhir
                  </Label>
                  <Input
                    id="meter_akhir"
                    name="meter_akhir"
                    type="number"
                    step="0.01"
                    value={formData.meter_akhir}
                    onChange={handleInputChange}
                    placeholder="Masukkan meter akhir"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/admin/dashboard">
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
                      <span>Simpan Data</span>
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