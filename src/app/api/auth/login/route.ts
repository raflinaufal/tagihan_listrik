import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password diperlukan' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(username, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
      role: user.role
    })

    const response = NextResponse.json({
      message: 'Login berhasil',
      user: {
        user_id: user.user_id,
        username: user.username,
        nama: user.nama,
        role: user.role,
        level: user.level,
        pelanggan: user.pelanggan
      }
    })

    // Set cookie untuk token dengan konfigurasi yang lebih aman
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 jam
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 