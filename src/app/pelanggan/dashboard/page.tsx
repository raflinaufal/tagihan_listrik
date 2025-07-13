'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LogOut, 
  Zap, 
  FileText, 
  User,
  Home,
  Activity,
  TrendingUp,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
  Shield,
  BarChart3
} from 'lucide-react'

interface Penggunaan {
  id_penggunaan: number
  id_pelanggan: number
  bulan: string
  tahun: number
  meter_awal: number
  meter_ahir: number
}

interface Tagihan {
  id_tagihan: number
  id_penggunaan: number
  id_pelanggan: number
  bulan: string
  tahun: number
  jumlah_meter: number
  status: string
}

interface PelangganData {
  id_pelanggan: number
  nama_pelanggan: string
  alamat: string
  nomor_kwh: string
  tarif: {
    daya: number
    tarifperkwh: number
  }
}

export default function PelangganDashboard() {
  const [penggunaan, setPenggunaan] = useState<Penggunaan[]>([])
  const [tagihan, setTagihan] = useState<Tagihan[]>([])
  const [pelangganData, setPelangganData] = useState<PelangganData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    fetchPelangganData()
  }, [])

  const fetchPelangganData = async () => {
    try {
      // Fetch pelanggan data
      const pelangganResponse = await fetch('/api/pelanggan/profile')
      if (pelangganResponse.ok) {
        const pelangganData = await pelangganResponse.json()
        setPelangganData(pelangganData)
      }

      // Fetch penggunaan data
      const penggunaanResponse = await fetch('/api/pelanggan/penggunaan')
      if (penggunaanResponse.ok) {
        const penggunaanData = await penggunaanResponse.json()
        setPenggunaan(penggunaanData)
      }

      // Fetch tagihan data
      const tagihanResponse = await fetch('/api/pelanggan/tagihan')
      if (tagihanResponse.ok) {
        const tagihanData = await tagihanResponse.json()
        setTagihan(tagihanData)
      }
    } catch (error) {
      console.error('Error fetching pelanggan data:', error)
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

  const getTotalKwh = () => {
    return penggunaan.reduce((sum, item) => sum + (item.meter_ahir - item.meter_awal), 0)
  }

  const getTotalTagihan = () => {
    if (!pelangganData?.tarif) return 0
    return tagihan.reduce((sum, item) => {
      return sum + (item.jumlah_meter * pelangganData.tarif.tarifperkwh)
    }, 0)
  }

  const getTagihanLunas = () => {
    return tagihan.filter(item => item.status === 'sudah_bayar').length
  }

  const getTagihanBelumLunas = () => {
    return tagihan.filter(item => item.status === 'belum_bayar').length
  }

  const getTotalPendapatan = () => {
    return tagihan
      .filter(item => item.status === 'sudah_bayar')
      .reduce((sum, item) => {
        if (!pelangganData?.tarif) return sum
        return sum + (item.jumlah_meter * pelangganData.tarif.tarifperkwh)
      }, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Pelanggan
                </h1>
                {pelangganData && (
                  <p className="text-sm text-gray-600">
                    {pelangganData.nama_pelanggan} • {pelangganData.nomor_kwh}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total KWH</CardTitle>
              <Zap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalKwh().toLocaleString()}</div>
              <p className="text-xs text-blue-100">Penggunaan listrik</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getTotalTagihan())}</div>
              <p className="text-xs text-green-100">Total tagihan</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Lunas</CardTitle>
              <CreditCard className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTagihanLunas()}</div>
              <p className="text-xs text-yellow-100">Tagihan dibayar</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
              <AlertTriangle className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTagihanBelumLunas()}</div>
              <p className="text-xs text-red-100">Menunggu pembayaran</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Informasi Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pelangganData ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{pelangganData.nama_pelanggan}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{pelangganData.alamat}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      No. KWH: {pelangganData.nomor_kwh}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Activity className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">
                      Daya: {pelangganData.tarif.daya} VA
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">
                      Tarif: {formatCurrency(pelangganData.tarif.tarifperkwh)}/KWH
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Ringkasan Keuangan
                </CardTitle>
                <CardDescription>Total pendapatan dan tagihan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(getTotalPendapatan())}
                    </div>
                    <p className="text-sm text-gray-600">Total Pendapatan</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(getTotalTagihan() - getTotalPendapatan())}
                    </div>
                    <p className="text-sm text-gray-600">Sisa Tagihan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Tables */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Data Penggunaan & Tagihan
                </CardTitle>
                <CardDescription>
                  Lihat data penggunaan listrik dan tagihan Anda
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="penggunaan" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Penggunaan Listrik
                </TabsTrigger>
                <TabsTrigger value="tagihan" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Tagihan Listrik
                </TabsTrigger>
              </TabsList>

              <TabsContent value="penggunaan" className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Periode</TableHead>
                          <TableHead className="font-semibold">Meter Awal</TableHead>
                          <TableHead className="font-semibold">Meter Akhir</TableHead>
                          <TableHead className="font-semibold">Total KWH</TableHead>
                          <TableHead className="font-semibold">Tarif per KWH</TableHead>
                          <TableHead className="font-semibold">Total Tagihan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {penggunaan.map((item) => {
                          const totalKwh = item.meter_ahir - item.meter_awal
                          const tarifPerKwh = pelangganData?.tarif.tarifperkwh || 0
                          const totalTagihan = totalKwh * tarifPerKwh
                          
                          return (
                            <TableRow key={item.id_penggunaan} className="hover:bg-gray-50">
                              <TableCell className="font-medium">
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
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tagihan" className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Periode</TableHead>
                          <TableHead className="font-semibold">Jumlah Meter</TableHead>
                          <TableHead className="font-semibold">Tarif per KWH</TableHead>
                          <TableHead className="font-semibold">Total Tagihan</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tagihan.map((item) => {
                          const tarifPerKwh = pelangganData?.tarif.tarifperkwh || 0
                          const totalTagihan = item.jumlah_meter * tarifPerKwh
                          
                          return (
                            <TableRow key={item.id_tagihan} className="hover:bg-gray-50">
                              <TableCell className="font-medium">
                                {item.bulan} {item.tahun}
                              </TableCell>
                              <TableCell>{item.jumlah_meter.toLocaleString()}</TableCell>
                              <TableCell>{formatCurrency(tarifPerKwh)}</TableCell>
                              <TableCell className="font-medium text-green-600">
                                {formatCurrency(totalTagihan)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.status === 'sudah_bayar' ? 'default' : 'secondary'} className="font-medium">
                                  {item.status === 'sudah_bayar' ? 'Lunas' : 'Belum Lunas'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 