import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: "Sistem Pembayaran Listrik - Manajemen Tagihan Pascabayar",
  description: "Aplikasi web berbasis Next.js untuk manajemen pembayaran listrik pascabayar dengan sistem client-server dan pembagian privilege (admin & pelanggan)",
  keywords: "pembayaran listrik, tagihan listrik, sistem admin, pelanggan, pascabayar",
  authors: [{ name: "Sistem Pembayaran Listrik" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
