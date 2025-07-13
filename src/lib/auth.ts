import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import crypto from 'crypto'

export interface UserPayload {
  user_id: number
  username: string
  role: string
}

export function hashPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex')
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const hashedInput = crypto.createHash('md5').update(password).digest('hex')
  return hashedInput === hashedPassword
}

export function generateToken(payload: UserPayload): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
  return jwt.sign(payload, secret, {
    expiresIn: '24h'
  })
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    return jwt.verify(token, secret) as UserPayload
  } catch {
    return null
  }
}

// Helper: Cek apakah user adalah pelanggan
export async function getPelangganByUsername(username: string) {
  return prisma.pelanggan.findUnique({ 
    where: { username },
    include: {
      tarif: true
    }
  })
}

export async function authenticateUser(username: string, password: string) {
  // Cek di tabel user (admin)
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      level: true
    }
  })

  if (user) {
    const isValidPassword = verifyPassword(password, user.password)
    if (isValidPassword) {
      // Cek apakah user juga terdaftar sebagai pelanggan
      const pelanggan = await getPelangganByUsername(username)
      const role = pelanggan ? 'pelanggan' : 'admin'
      
      return {
        user_id: user.id_user,
        username: user.username,
        nama: user.nama_admin,
        role,
        level: user.level?.nama_level,
        pelanggan
      }
    }
  }

  // Jika tidak ada di tabel user, cek di tabel pelanggan
  const pelanggan = await prisma.pelanggan.findUnique({
    where: { username },
    include: {
      tarif: true
    }
  })

  if (pelanggan) {
    const isValidPassword = verifyPassword(password, pelanggan.password)
    if (isValidPassword) {
      return {
        user_id: pelanggan.id_pelanggan,
        username: pelanggan.username,
        nama: pelanggan.nama_pelanggan,
        role: 'pelanggan',
        pelanggan: {
          id_pelanggan: pelanggan.id_pelanggan,
          nama_pelanggan: pelanggan.nama_pelanggan,
          alamat: pelanggan.alamat,
          nomor_kwh: pelanggan.nomor_kwh,
          tarif: pelanggan.tarif
        }
      }
    }
  }

  return null
} 