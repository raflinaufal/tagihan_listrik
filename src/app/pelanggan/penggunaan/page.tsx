"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import PelangganNav from '@/components/PelangganNav';

interface Penggunaan {
  id_penggunaan: number;
  id_pelanggan: number;
  bulan: string;
  tahun: number;
  meter_awal: number;
  meter_ahir: number;
}

export default function PenggunaanPage() {
  const [penggunaan, setPenggunaan] = useState<Penggunaan[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PelangganNav />
      <div className="max-w-4xl mx-auto px-2 py-6 lg:pl-60 pb-20 lg:pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Penggunaan Listrik
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Periode</TableHead>
                      <TableHead className="hidden sm:table-cell">Meter Awal</TableHead>
                      <TableHead className="hidden sm:table-cell">Meter Akhir</TableHead>
                      <TableHead>Total KWH</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {penggunaan.map((item) => {
                      const totalKwh = item.meter_ahir - item.meter_awal;
                      return (
                        <TableRow key={item.id_penggunaan}>
                          <TableCell>{item.bulan} {item.tahun}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.meter_awal}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.meter_ahir}</TableCell>
                          <TableCell className="font-medium text-blue-600">{totalKwh}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 