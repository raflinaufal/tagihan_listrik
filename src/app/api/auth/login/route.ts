import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validasi input yang lebih detail
    if (!username || !password) {
      return NextResponse.json(
        { 
          error: 'Username dan password diperlukan',
          details: {
            username: !username ? 'Username wajib diisi' : null,
            password: !password ? 'Password wajib diisi' : null
          }
        },
        { status: 400 }
      )
    }

    // Validasi format
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Format data tidak valid' },
        { status: 400 }
      )
    }

    // Validasi panjang minimum
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
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
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { error: 'Tidak dapat terhubung ke database' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 