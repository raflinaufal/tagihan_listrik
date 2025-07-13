"use client"
import React, { useEffect, useMemo, useState } from 'react';
import PelangganNav from '@/components/PelangganNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Penggunaan {
  id_penggunaan: number;
  id_pelanggan: number;
  bulan: string;
  tahun: number;
  meter_awal: number;
  meter_ahir: number;
}

const PAGE_SIZE = 5;

export default function PenggunaanPage() {
  const [penggunaan, setPenggunaan] = useState<Penggunaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'periode'|'meter_awal'|'meter_ahir'|'total_kwh'>('periode');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPenggunaan();
  }, []);

  const fetchPenggunaan = async () => {
    try {
      const response = await fetch('/api/pelanggan/penggunaan');
      if (response.ok) {
        const data = await response.json();
        setPenggunaan(data);
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Filter & sort data
  const filtered = useMemo(() => {
    let data = [...penggunaan];
    if (search) {
      data = data.filter(item =>
        item.bulan.toLowerCase().includes(search.toLowerCase()) ||
        item.tahun.toString().includes(search) ||
        item.meter_awal.toString().includes(search) ||
        item.meter_ahir.toString().includes(search)
      );
    }
    data.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'periode') {
        aVal = `${a.tahun}${a.bulan}`;
        bVal = `${b.tahun}${b.bulan}`;
      } else if (sortBy === 'meter_awal') {
        aVal = a.meter_awal;
        bVal = b.meter_awal;
      } else if (sortBy === 'meter_ahir') {
        aVal = a.meter_ahir;
        bVal = b.meter_ahir;
      } else {
        aVal = a.meter_ahir - a.meter_awal;
        bVal = b.meter_ahir - b.meter_awal;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [penggunaan, search, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

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
      <div className="max-w-7xl mx-auto px-2 py-6 lg:pl-60 pb-20 lg:pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Penggunaan Listrik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <Input
                placeholder="Cari bulan, tahun, meter..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
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
                        <TableHead onClick={() => handleSort('meter_awal')} className="cursor-pointer select-none">Meter Awal {sortBy==='meter_awal' ? (sortDir==='asc'?'▲':'▼') : ''}</TableHead>
                        <TableHead onClick={() => handleSort('meter_ahir')} className="cursor-pointer select-none">Meter Akhir {sortBy==='meter_ahir' ? (sortDir==='asc'?'▲':'▼') : ''}</TableHead>
                        <TableHead onClick={() => handleSort('total_kwh')} className="cursor-pointer select-none">Total KWH {sortBy==='total_kwh' ? (sortDir==='asc'?'▲':'▼') : ''}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paged.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">Tidak ada data</TableCell>
                        </TableRow>
                      ) : paged.map((item) => {
                        const totalKwh = item.meter_ahir - item.meter_awal;
                        return (
                          <TableRow key={item.id_penggunaan}>
                            <TableCell>{item.bulan} {item.tahun}</TableCell>
                            <TableCell>{item.meter_awal}</TableCell>
                            <TableCell>{item.meter_ahir}</TableCell>
                            <TableCell className="font-medium text-blue-600">{totalKwh}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {/* Pagination Desktop */}
                  <div className="flex justify-between items-center mt-4 px-2">
                    <span className="text-sm text-gray-600">Menampilkan {paged.length} dari {filtered.length} data</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" disabled={page===1} onClick={()=>setPage(page-1)}>Sebelumnya</Button>
                      <span className="px-2 py-1 text-sm">{page} / {totalPages||1}</span>
                      <Button size="sm" variant="outline" disabled={page===totalPages||totalPages===0} onClick={()=>setPage(page+1)}>Berikutnya</Button>
                    </div>
                  </div>
                </div>
                {/* Mobile List/Card */}
                <div className="flex flex-col gap-3 md:hidden">
                  {paged.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Tidak ada data</div>
                  ) : paged.map((item) => {
                    const totalKwh = item.meter_ahir - item.meter_awal;
                    return (
                      <div key={item.id_penggunaan} className="rounded-xl border bg-white shadow-sm px-4 py-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-700">{item.bulan} {item.tahun}</span>
                          <span className="font-bold text-blue-600 text-lg">{totalKwh} kWh</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Meter Awal: <span className="font-medium text-gray-700">{item.meter_awal}</span></span>
                          <span>Meter Akhir: <span className="font-medium text-gray-700">{item.meter_ahir}</span></span>
                        </div>
                      </div>
                    );
                  })}
                  {/* Pagination Mobile */}
                  <div className="flex justify-between items-center mt-2 px-1">
                    <Button size="sm" variant="outline" className="flex-1 mr-2" disabled={page===1} onClick={()=>setPage(page-1)}>Sebelumnya</Button>
                    <span className="px-2 py-1 text-sm">{page} / {totalPages||1}</span>
                    <Button size="sm" variant="outline" className="flex-1 ml-2" disabled={page===totalPages||totalPages===0} onClick={()=>setPage(page+1)}>Berikutnya</Button>
                  </div>
                  <span className="text-xs text-gray-400 text-center mt-1">Menampilkan {paged.length} dari {filtered.length} data</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 