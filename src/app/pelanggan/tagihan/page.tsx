"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BadgeCheck, AlertTriangle } from 'lucide-react';
import PelangganNav from '@/components/PelangganNav';

interface Tagihan {
  id_tagihan: number;
  bulan: string;
  tahun: number;
  jumlah_meter: number;
  status: string;
}

export default function TagihanPage() {
  const [tagihan, setTagihan] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTagihan();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PelangganNav />
      <div className="max-w-4xl mx-auto px-2 py-6 lg:pl-60 pb-20 lg:pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Tagihan Listrik
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
                      <TableHead className="hidden sm:table-cell">Jumlah Meter</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tagihan.map((item) => (
                      <TableRow key={item.id_tagihan}>
                        <TableCell>{item.bulan} {item.tahun}</TableCell>
                        <TableCell className="hidden sm:table-cell">{item.jumlah_meter}</TableCell>
                        <TableCell>
                          {item.status === 'sudah_bayar' ? (
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                              <BadgeCheck className="h-4 w-4" /> Lunas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                              <AlertTriangle className="h-4 w-4" /> Belum Lunas
                            </span>
                          )}
                        </TableCell>
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