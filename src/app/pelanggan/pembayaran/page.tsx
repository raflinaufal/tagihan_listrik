"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import PelangganNav from '@/components/PelangganNav';
import { Input } from '@/components/ui/input';

interface Pembayaran {
  id_pembayaran: number;
  tanggal_pembayaran: string;
  total_bayar: number;
  biaya_admin: number;
  tagihan?: {
    bulan: string;
    tahun: number;
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PembayaranPage() {
  const [pembayaran, setPembayaran] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'periode'|'tanggal'|'biaya_admin'|'total_bayar'>('tanggal');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');

  useEffect(() => {
    fetchPembayaran();
  }, []);

  const fetchPembayaran = async () => {
    try {
      const response = await fetch('/api/pelanggan/pembayaran');
      if (response.ok) {
        const data = await response.json();
        setPembayaran(data);
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Filter pembayaran berdasarkan search
  const filteredPembayaran = pembayaran.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      (item.tagihan?.bulan?.toLowerCase().includes(searchLower) || false) ||
      (item.tagihan?.tahun?.toString().includes(searchLower) || false) ||
      (item.total_bayar?.toString().includes(searchLower) || false) ||
      (item.biaya_admin?.toString().includes(searchLower) || false)
    );
  });

  // Sort pembayaran
  const sortedPembayaran = [...filteredPembayaran].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'periode') {
      aVal = `${a.tagihan?.tahun || ''}${a.tagihan?.bulan || ''}`;
      bVal = `${b.tagihan?.tahun || ''}${b.tagihan?.bulan || ''}`;
    } else if (sortBy === 'tanggal') {
      aVal = a.tanggal_pembayaran || '';
      bVal = b.tanggal_pembayaran || '';
    } else if (sortBy === 'biaya_admin') {
      aVal = a.biaya_admin || 0;
      bVal = b.biaya_admin || 0;
    } else {
      aVal = a.total_bayar || 0;
      bVal = b.total_bayar || 0;
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PelangganNav />
      <div className="max-w-7xl mx-auto px-3 py-6 lg:pl-60 pb-28 lg:pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Riwayat Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <Input
                placeholder="Cari bulan, tahun, nominal..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="rounded-lg border overflow-x-auto hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead onClick={() => handleSort('periode')} className="cursor-pointer select-none">Periode {sortBy==='periode' ? (sortDir==='asc'?'▲':'▼') : ''}</TableHead>
                        <TableHead onClick={() => handleSort('tanggal')} className="cursor-pointer select-none">Tanggal Bayar {sortBy==='tanggal' ? (sortDir==='asc'?'▲':'▼') : ''}</TableHead>
                        <TableHead onClick={() => handleSort('biaya_admin')} className="cursor-pointer select-none">Biaya Admin {sortBy==='biaya_admin' ? (sortDir==='asc'?'▲':'▼') : ''}</TableHead>
                        <TableHead onClick={() => handleSort('total_bayar')} className="cursor-pointer select-none">Total Bayar {sortBy==='total_bayar' ? (sortDir==='asc'?'▲':'▼') : ''}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPembayaran.map((item) => (
                        <TableRow key={item.id_pembayaran}>
                          <TableCell>
                            {item.tagihan?.bulan} {item.tagihan?.tahun}
                          </TableCell>
                          <TableCell>
                            {item.tanggal_pembayaran ? formatDate(item.tanggal_pembayaran) : 'N/A'}
                          </TableCell>
                          <TableCell>{formatCurrency(item.biaya_admin || 0)}</TableCell>
                          <TableCell className="font-medium text-green-600">{formatCurrency(item.total_bayar || 0)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile List/Card */}
                <div className="flex flex-col gap-4 md:hidden">
                  {sortedPembayaran.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Tidak ada data pembayaran</div>
                  ) : sortedPembayaran.map((item) => (
                    <div key={item.id_pembayaran} className="rounded-xl border bg-white shadow-sm px-4 py-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-blue-700 text-base">{item.tagihan?.bulan} {item.tagihan?.tahun}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <span><span className="font-medium text-gray-500">Tanggal Bayar:</span> {item.tanggal_pembayaran ? formatDate(item.tanggal_pembayaran) : 'N/A'}</span>
                        <span><span className="font-medium text-gray-500">Biaya Admin:</span> <span className="text-gray-700">{formatCurrency(item.biaya_admin || 0)}</span></span>
                        <span><span className="font-medium text-gray-500">Total Bayar:</span> <span className="text-green-600 font-bold">{formatCurrency(item.total_bayar || 0)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 