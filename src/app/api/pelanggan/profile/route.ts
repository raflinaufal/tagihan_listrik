import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    // Get pelanggan data
    const pelanggan = await prisma.pelanggan.findUnique({
      where: { id_pelanggan: payload.user_id },
      include: {
        tarif: true
      }
    })

    if (!pelanggan) {
      return NextResponse.json(
        { error: 'Data pelanggan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id_pelanggan: pelanggan.id_pelanggan,
      nama_pelanggan: pelanggan.nama_pelanggan,
      alamat: pelanggan.alamat,
      nomor_kwh: pelanggan.nomor_kwh,
      tarif: pelanggan.tarif ? {
        daya: pelanggan.tarif.daya,
        tarifperkwh: pelanggan.tarif.tarifperkwh
      } : null
    })
  } catch (error) {
    console.error('Error fetching pelanggan profile:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 