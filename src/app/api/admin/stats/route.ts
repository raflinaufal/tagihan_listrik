import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get basic counts
    const total_pelanggan = await prisma.pelanggan.count()
    const total_penggunaan = await prisma.penggunaan.count()
    const total_tagihan = await prisma.tagihan.count()
    const tagihan_lunas = await prisma.tagihan.count({
      where: { status: 'sudah_bayar' }
    })
    const tagihan_belum_lunas = await prisma.tagihan.count({
      where: { status: 'belum_bayar' }
    })

    // Calculate total pendapatan from paid invoices
    const pembayaran = await prisma.pembayaran.findMany({
      where: {
        tagihan: {
          status: 'sudah_bayar'
        }
      },
      include: {
        tagihan: {
          include: {
            pelanggan: {
              include: {
                tarif: true
              }
            }
          }
        }
      }
    })

    const total_pendapatan = pembayaran.reduce((sum, p) => {
      if (p.total_bayar) {
        return sum + Number(p.total_bayar)
      }
      return sum
    }, 0)

    return NextResponse.json({
      total_pelanggan,
      total_penggunaan,
      total_tagihan,
      tagihan_lunas,
      tagihan_belum_lunas,
      total_pendapatan
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 