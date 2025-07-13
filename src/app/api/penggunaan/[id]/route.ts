import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// PUT - Update data penggunaan listrik
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

    // Hanya admin yang bisa update data
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const penggunaanId = parseInt(params.id)
    const { bulan, tahun, meter_awal, meter_akhir } = await request.json()

    // Validasi input
    if (meter_akhir < meter_awal) {
      return NextResponse.json(
        { error: 'Meter akhir harus lebih besar dari meter awal' },
        { status: 400 }
      )
    }

    // Cek apakah data penggunaan ada
    const existingPenggunaan = await prisma.penggunaan.findUnique({
      where: { id_penggunaan: penggunaanId }
    })

    if (!existingPenggunaan) {
      return NextResponse.json(
        { error: 'Data penggunaan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update data
    const updatedPenggunaan = await prisma.penggunaan.update({
      where: { id_penggunaan: penggunaanId },
      data: {
        bulan: bulan.toString(),
        tahun: parseInt(tahun),
        meter_awal: parseInt(meter_awal),
        meter_ahir: parseInt(meter_akhir)
      },
      include: {
        pelanggan: {
          include: {
            tarif: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Data penggunaan berhasil diupdate',
      data: updatedPenggunaan
    })
  } catch (error) {
    console.error('Error updating penggunaan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// DELETE - Hapus data penggunaan listrik
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

    // Hanya admin yang bisa hapus data
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const penggunaanId = parseInt(params.id)

    // Cek apakah data penggunaan ada
    const existingPenggunaan = await prisma.penggunaan.findUnique({
      where: { id_penggunaan: penggunaanId }
    })

    if (!existingPenggunaan) {
      return NextResponse.json(
        { error: 'Data penggunaan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Hapus data
    await prisma.penggunaan.delete({
      where: { id_penggunaan: penggunaanId }
    })

    return NextResponse.json({
      message: 'Data penggunaan berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting penggunaan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 