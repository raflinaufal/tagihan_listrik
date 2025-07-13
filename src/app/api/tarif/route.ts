import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET semua tarif
export async function GET() {
  try {
    const data = await prisma.tarif.findMany({
      orderBy: { daya: 'asc' }
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tarif:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST tambah tarif
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validasi input
    if (!body.daya || !body.tarifperkwh) {
      return NextResponse.json(
        { error: 'Daya dan tarif per KWH harus diisi' },
        { status: 400 }
      );
    }

    const tarif = await prisma.tarif.create({
      data: {
        daya: body.daya,
        tarifperkwh: body.tarifperkwh
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Tarif berhasil ditambahkan',
      data: tarif
    });
  } catch (error) {
    console.error('Error creating tarif:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 