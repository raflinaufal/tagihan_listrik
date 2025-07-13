import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET semua pembayaran beserta relasi
export async function GET() {
  const data = await prisma.pembayaran.findMany({
    include: {
      tagihan: true,
      pelanggan: { include: { tarif: true } },
      user: true
    }
  });
  return NextResponse.json(data);
}

// POST tambah pembayaran
export async function POST(req: Request) {
  const body = await req.json();
  const pembayaran = await prisma.pembayaran.create({
    data: {
      id_tagihan: body.id_tagihan,
      id_pelanggan: body.id_pelanggan,
      tanggal_pembayaran: body.tanggal_pembayaran,
      bulan_bayar: body.bulan_bayar,
      biaya_admin: body.biaya_admin,
      total_bayar: body.total_bayar,
      id_user: body.id_user
    }
  });
  return NextResponse.json(pembayaran);
}

// PUT update pembayaran
export async function PUT(req: Request) {
  const body = await req.json();
  const pembayaran = await prisma.pembayaran.update({
    where: { id_pembayaran: body.id_pembayaran },
    data: {
      id_tagihan: body.id_tagihan,
      id_pelanggan: body.id_pelanggan,
      tanggal_pembayaran: body.tanggal_pembayaran,
      bulan_bayar: body.bulan_bayar,
      biaya_admin: body.biaya_admin,
      total_bayar: body.total_bayar,
      id_user: body.id_user
    }
  });
  return NextResponse.json(pembayaran);
}

// DELETE pembayaran
export async function DELETE(req: Request) {
  const { id_pembayaran } = await req.json();
  await prisma.pembayaran.delete({ where: { id_pembayaran } });
  return NextResponse.json({ success: true });
} 