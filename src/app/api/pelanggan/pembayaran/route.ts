import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }

    // Get pelanggan data
    const pelanggan = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: payload.user_id }
    });

    if (!pelanggan) {
      return NextResponse.json(
        { error: 'Data pelanggan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get pembayaran data for this pelanggan
    const data = await prisma.pembayaran.findMany({
      where: {
        id_pelanggan: pelanggan.id_pelanggan
      },
      include: {
        tagihan: true,
        user: true
      },
      orderBy: {
        tanggal_pembayaran: 'desc'
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching pembayaran:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 