import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// GET semua pelanggan beserta relasi
export async function GET() {
  try {
    const data = await prisma.pelanggan.findMany({
      include: {
        tarif: true,
        penggunaan: true,
        tagihan: true,
        pembayaran: true
      },
      orderBy: { nama_pelanggan: 'asc' }
    });
    
    // Transform data to match frontend expectations
    const transformedData = data.map(item => ({
      id_pelanggan: item.id_pelanggan,
      username: item.username,
      nama_pelanggan: item.nama_pelanggan,
      alamat: item.alamat,
      nomor_kwh: item.nomor_kwh,
      tarif: item.tarif ? {
        daya: item.tarif.daya,
        tarifperkwh: item.tarif.tarifperkwh
      } : null
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching pelanggan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST tambah pelanggan
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validasi input
    if (!body.username || !body.password || !body.nama_pelanggan || !body.nomor_kwh) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.pelanggan.findUnique({
      where: { username: body.username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 400 }
      );
    }

    // Check if nomor_kwh already exists
    const existingKWH = await prisma.pelanggan.findUnique({
      where: { nomor_kwh: body.nomor_kwh }
    });

    if (existingKWH) {
      return NextResponse.json(
        { error: 'Nomor KWH sudah terdaftar' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(body.password);
    
    const pelanggan = await prisma.pelanggan.create({
      data: {
        username: body.username,
        password: hashedPassword,
        nomor_kwh: body.nomor_kwh,
        nama_pelanggan: body.nama_pelanggan,
        alamat: body.alamat,
        id_tarif: body.id_tarif
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Pelanggan berhasil ditambahkan',
      data: pelanggan
    });
  } catch (error) {
    console.error('Error creating pelanggan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT update pelanggan
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.id_pelanggan) {
      return NextResponse.json(
        { error: 'ID pelanggan diperlukan' },
        { status: 400 }
      );
    }

    const updateData: any = {
      username: body.username,
      nama_pelanggan: body.nama_pelanggan,
      alamat: body.alamat,
      nomor_kwh: body.nomor_kwh,
      id_tarif: body.id_tarif
    };

    // Only update password if provided
    if (body.password) {
      updateData.password = hashPassword(body.password);
    }
    
    const pelanggan = await prisma.pelanggan.update({
      where: { id_pelanggan: body.id_pelanggan },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      message: 'Pelanggan berhasil diupdate',
      data: pelanggan
    });
  } catch (error) {
    console.error('Error updating pelanggan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE pelanggan
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id_pelanggan } = body;
    
    if (!id_pelanggan) {
      return NextResponse.json(
        { error: 'ID pelanggan diperlukan' },
        { status: 400 }
      );
    }

    // Delete related data first (cascade delete)
    await prisma.pembayaran.deleteMany({
      where: { id_pelanggan }
    });

    await prisma.tagihan.deleteMany({
      where: { id_pelanggan }
    });

    await prisma.penggunaan.deleteMany({
      where: { id_pelanggan }
    });

    // Then delete pelanggan
    await prisma.pelanggan.delete({ 
      where: { id_pelanggan } 
    });
    
    return NextResponse.json({
      success: true,
      message: 'Pelanggan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting pelanggan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 