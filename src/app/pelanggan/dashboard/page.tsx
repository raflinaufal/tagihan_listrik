'use client'

import { useState, useEffect, useMemo } from 'react'
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

export default function DashboardPage() {
  const [penggunaan, setPenggunaan] = useState<Penggunaan[]>([])
  const [tagihan, setTagihan] = useState<any[]>([]);
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

  useEffect(() => {
    fetchTagihan();
  }, []);

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

  const fetchTagihan = async () => {
    try {
      const response = await fetch('/api/pelanggan/tagihan');
      if (response.ok) {
        const data = await response.json();
        setTagihan(data);
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Proses data tagihan menjadi data grafik per bulan
  const chartData = useMemo(() => {
    const monthMap: Record<string, number> = {};
    tagihan.forEach((item) => {
      const key = `${item.bulan} ${item.tahun}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    // Urutkan bulan-tahun
    return Object.entries(monthMap).map(([bulan, total]) => ({ bulan, total }));
  }, [tagihan]);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 lg:pl-64 pb-28 lg:pb-6">
       

        {/* Statistik Utama */}
        <div className="flex flex-col gap-4 my-6 md:grid md:grid-cols-3 md:gap-6">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl p-0">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Total Tagihan</CardTitle>
                <div className="text-2xl font-bold mt-1">{formatCurrency(getTotalTagihan())}</div>
                <p className="text-xs text-green-100">Total tagihan</p>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl p-0">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Sudah Lunas</CardTitle>
                <div className="text-2xl font-bold mt-1">{getTagihanLunas()}</div>
                <p className="text-xs text-yellow-100">Tagihan dibayar</p>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl p-0">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Belum Lunas</CardTitle>
                <div className="text-2xl font-bold mt-1">{getTagihanBelumLunas()}</div>
                <p className="text-xs text-pink-100">Menunggu pembayaran</p>
              </div>
            </CardHeader>
          </Card>
        </div>
        {/* Chart Tagihan per Bulan */}
        <Card className="rounded-2xl shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Grafik Tagihan per Bulan</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#2563eb" name="Jumlah Tagihan" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 