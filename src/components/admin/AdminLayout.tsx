'use client'

import AdminSidebar from './AdminSidebar'
import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
  onLogout?: () => void
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={onLogout} />
      
      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        {/* Mobile Header Spacer */}
        <div className="lg:hidden h-16"></div>
        
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
} 