'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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
  BarChart3,
  Menu,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react'
import PelangganNav from '@/components/PelangganNav';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

interface Pembayaran {
  id_pembayaran: number
  id_tagihan: number
  id_pelanggan: number
  tanggal_pembayaran: string
  bulan_bayar: string
  biaya_admin: number
  total_bayar: number
  id_user: number
  tagihan?: {
    bulan: string
    tahun: number
  }
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

// Contoh data dummy grafik tagihan per bulan
const chartData = [
  { bulan: 'Jan', total: 1 },
  { bulan: 'Feb', total: 2 },
  { bulan: 'Mar', total: 1 },
  { bulan: 'Apr', total: 0 },
  { bulan: 'Mei', total: 3 },
  { bulan: 'Jun', total: 2 },
  { bulan: 'Jul', total: 1 },
];

export default function DashboardPage() {
  const [penggunaan, setPenggunaan] = useState<Penggunaan[]>([])
  const [tagihan, setTagihan] = useState<Tagihan[]>([])
  const [pembayaran, setPembayaran] = useState<Pembayaran[]>([])
  const [pelangganData, setPelangganData] = useState<PelangganData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('penggunaan')
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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

      // Fetch pembayaran data
      const pembayaranResponse = await fetch('/api/pelanggan/pembayaran')
      if (pembayaranResponse.ok) {
        const pembayaranData = await pembayaranResponse.json()
        setPembayaran(pembayaranData)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
    return pembayaran.reduce((sum, item) => sum + (item.total_bayar || 0), 0)
  }

  const getTotalBiayaAdmin = () => {
    return pembayaran.reduce((sum, item) => sum + (item.biaya_admin || 0), 0)
  }

  const getPembayaranBulanIni = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return pembayaran.filter(item => {
      const paymentDate = new Date(item.tanggal_pembayaran)
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
    }).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PelangganNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:pl-64 pb-20 lg:pb-6">
       

        {/* Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getTotalTagihan())}</div>
              <p className="text-xs text-green-100">Total tagihan</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Lunas</CardTitle>
              <CreditCard className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTagihanLunas()}</div>
              <p className="text-xs text-yellow-100">Tagihan dibayar</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
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

        {/* Grafik Tagihan per Bulan */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Grafik Tagihan per Bulan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#2563eb" name="Jumlah Tagihan" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 