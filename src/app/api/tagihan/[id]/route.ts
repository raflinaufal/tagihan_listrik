import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// PUT - Update tagihan (bisa update bulan, tahun, jumlah_meter, status)
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

    // Hanya admin yang bisa update tagihan
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const tagihanId = parseInt(params.id)
    const body = await request.json()
    const { bulan, tahun, jumlah_meter, status } = body

    // Validasi
    if (!bulan || !tahun || jumlah_meter === undefined || !status || !['sudah_bayar', 'belum_bayar'].includes(status)) {
      return NextResponse.json(
        { error: 'Data tidak lengkap atau status tidak valid' },
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

    // Update tagihan
    const updatedTagihan = await prisma.tagihan.update({
      where: { id_tagihan: tagihanId },
      data: { bulan, tahun, jumlah_meter, status },
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
      message: 'Tagihan berhasil diupdate',
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

// DELETE - Hapus tagihan
export async function DELETE(
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

    // Hanya admin yang bisa hapus tagihan
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const tagihanId = parseInt(params.id)

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

    // Hapus tagihan
    await prisma.tagihan.delete({
      where: { id_tagihan: tagihanId }
    })

    return NextResponse.json({
      message: 'Tagihan berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting tagihan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 