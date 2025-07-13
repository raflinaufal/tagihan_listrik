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

    // Get pelanggan's penggunaan data
    const penggunaan = await prisma.penggunaan.findMany({
      where: { id_pelanggan: payload.user_id },
      orderBy: [
        { tahun: 'desc' },
        { bulan: 'desc' }
      ]
    })

    return NextResponse.json(penggunaan)
  } catch (error) {
    console.error('Error fetching pelanggan penggunaan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 