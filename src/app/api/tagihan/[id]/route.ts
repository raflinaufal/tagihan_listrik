import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// PUT - Update status tagihan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    // Hanya admin yang bisa update status tagihan
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const tagihanId = parseInt(params.id)
    const { status } = await request.json()

    // Validasi status
    if (!status || !['sudah_bayar', 'belum_bayar'].includes(status)) {
      return NextResponse.json(
        { error: 'Status harus sudah_bayar atau belum_bayar' },
        { status: 400 }
      )
    }

    // Cek apakah tagihan ada
    const existingTagihan = await prisma.tagihan.findUnique({
      where: { id_tagihan: tagihanId }
    })

    if (!existingTagihan) {
      return NextResponse.json(
        { error: 'Tagihan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update status tagihan
    const updatedTagihan = await prisma.tagihan.update({
      where: { id_tagihan: tagihanId },
      data: { status },
      include: {
        penggunaan: {
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

    return NextResponse.json({
      message: 'Status tagihan berhasil diupdate',
      data: updatedTagihan
    })
  } catch (error) {
    console.error('Error updating tagihan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 