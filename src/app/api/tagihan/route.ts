import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET semua tagihan
export async function GET() {
  try {
    const data = await prisma.tagihan.findMany({
      include: {
        pelanggan: {
          include: {
            tarif: true
          }
        },
        penggunaan: true
      },
      orderBy: [
        { tahun: 'desc' },
        { bulan: 'desc' }
      ]
    });
    
    // Transform data to match frontend expectations
    const transformedData = data.map(item => ({
      id_tagihan: item.id_tagihan,
      id_penggunaan: item.id_penggunaan,
      id_pelanggan: item.id_pelanggan,
      bulan: item.bulan,
      tahun: item.tahun,
      jumlah_meter: item.jumlah_meter,
      status: item.status,
      pelanggan: item.pelanggan ? {
        nama_pelanggan: item.pelanggan.nama_pelanggan
      } : null
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching tagihan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT update status tagihan
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.id_tagihan || !body.status) {
      return NextResponse.json(
        { error: 'ID tagihan dan status diperlukan' },
        { status: 400 }
      );
    }

    if (!['belum_bayar', 'sudah_bayar'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }

    const tagihan = await prisma.tagihan.update({
      where: { id_tagihan: body.id_tagihan },
      data: { status: body.status }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Status tagihan berhasil diupdate',
      data: tagihan
    });
  } catch (error) {
    console.error('Error updating tagihan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 