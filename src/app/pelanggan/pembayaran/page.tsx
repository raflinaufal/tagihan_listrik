"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import PelangganNav from '@/components/PelangganNav';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PelangganNav />
      <div className="max-w-4xl mx-auto px-2 py-6 lg:pl-60 pb-20 lg:pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Riwayat Pembayaran
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
                      <TableHead className="hidden sm:table-cell">Tanggal Bayar</TableHead>
                      <TableHead className="hidden md:table-cell">Biaya Admin</TableHead>
                      <TableHead>Total Bayar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pembayaran.map((item) => (
                      <TableRow key={item.id_pembayaran}>
                        <TableCell>
                          {item.tagihan?.bulan} {item.tagihan?.tahun}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {item.tanggal_pembayaran ? formatDate(item.tanggal_pembayaran) : 'N/A'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(item.biaya_admin || 0)}</TableCell>
                        <TableCell className="font-medium text-green-600">{formatCurrency(item.total_bayar || 0)}</TableCell>
                      </TableRow>
                    ))}
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