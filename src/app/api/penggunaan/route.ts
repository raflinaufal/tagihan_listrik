import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET semua penggunaan
export async function GET() {
  try {
    const data = await prisma.penggunaan.findMany({
      include: {
        pelanggan: {
          include: {
            tarif: true
          }
        }
      },
      orderBy: [
        { tahun: 'desc' },
        { bulan: 'desc' }
      ]
    });
    
    // Transform data to match frontend expectations
    const transformedData = data.map(item => ({
      id_penggunaan: item.id_penggunaan,
      id_pelanggan: item.id_pelanggan,
      bulan: item.bulan,
      tahun: item.tahun,
      meter_awal: item.meter_awal,
      meter_ahir: item.meter_ahir,
      pelanggan: item.pelanggan ? {
        nama_pelanggan: item.pelanggan.nama_pelanggan,
        alamat: item.pelanggan.alamat,
        tarif: item.pelanggan.tarif ? {
          daya: item.pelanggan.tarif.daya,
          tarifperkwh: item.pelanggan.tarif.tarifperkwh
        } : null
      } : null
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching penggunaan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST tambah penggunaan
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validasi input
    if (!body.id_pelanggan || !body.bulan || !body.tahun || 
        body.meter_awal === undefined || body.meter_ahir === undefined) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (body.meter_ahir <= body.meter_awal) {
      return NextResponse.json(
        { error: 'Meter akhir harus lebih besar dari meter awal' },
        { status: 400 }
      );
    }

    // Check if pelanggan exists
    const pelanggan = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: body.id_pelanggan }
    });

    if (!pelanggan) {
      return NextResponse.json(
        { error: 'Pelanggan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if penggunaan already exists for this month and year
    const existingPenggunaan = await prisma.penggunaan.findFirst({
      where: {
        id_pelanggan: body.id_pelanggan,
        bulan: body.bulan,
        tahun: body.tahun
      }
    });

    if (existingPenggunaan) {
      return NextResponse.json(
        { error: 'Data penggunaan untuk periode ini sudah ada' },
        { status: 400 }
      );
    }
    
    const penggunaan = await prisma.penggunaan.create({
      data: {
        id_pelanggan: body.id_pelanggan,
        bulan: body.bulan,
        tahun: body.tahun,
        meter_awal: body.meter_awal,
        meter_ahir: body.meter_ahir
      }
    });
    
    // Create tagihan automatically
    const jumlah_meter = body.meter_ahir - body.meter_awal;
    
    const tagihan = await prisma.tagihan.create({
      data: {
        id_penggunaan: penggunaan.id_penggunaan,
        id_pelanggan: body.id_pelanggan,
        bulan: body.bulan,
        tahun: body.tahun,
        jumlah_meter: jumlah_meter,
        status: 'belum_bayar'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Penggunaan berhasil ditambahkan',
      data: {
        penggunaan,
        tagihan
      }
    });
  } catch (error) {
    console.error('Error creating penggunaan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT update penggunaan
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.id_penggunaan) {
      return NextResponse.json(
        { error: 'ID penggunaan diperlukan' },
        { status: 400 }
      );
    }

    const penggunaan = await prisma.penggunaan.update({
      where: { id_penggunaan: body.id_penggunaan },
      data: {
        id_pelanggan: body.id_pelanggan,
        bulan: body.bulan,
        tahun: body.tahun,
        meter_awal: body.meter_awal,
        meter_ahir: body.meter_ahir
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Penggunaan berhasil diupdate',
      data: penggunaan
    });
  } catch (error) {
    console.error('Error updating penggunaan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE penggunaan
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id_penggunaan } = body;
    
    if (!id_penggunaan) {
      return NextResponse.json(
        { error: 'ID penggunaan diperlukan' },
        { status: 400 }
      );
    }

    // Delete related tagihan first
    await prisma.tagihan.deleteMany({
      where: { id_penggunaan }
    });

    // Then delete penggunaan
    await prisma.penggunaan.delete({ 
      where: { id_penggunaan } 
    });
    
    return NextResponse.json({
      success: true,
      message: 'Penggunaan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting penggunaan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 