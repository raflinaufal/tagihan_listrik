import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, BarChart2, FileText, LogOut, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Pelanggan', href: '/admin/pelanggan', icon: Users },
  { name: 'Penggunaan', href: '/admin/penggunaan', icon: BarChart2 },
  { name: 'Tarif', href: '/admin/tarif', icon: FileText },
  { name: 'Tagihan', href: '/admin/tagihan', icon: FileText },
  { name: 'Pembayaran', href: '/admin/pembayaran', icon: CreditCard },
]

interface AdminSidebarProps {
  onLogout?: () => void
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()
  
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col bg-gradient-to-b from-blue-500 to-indigo-500 text-white">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
        <div className="flex h-16 items-center">
          <h1 className="text-xl font-bold tracking-wide">Sistem Listrik</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="space-y-1">
                {navigation.map((item, idx) => (
                  <li key={item.name}>
                    {idx === 1 && (
                      <div className="uppercase text-xs font-bold text-blue-200 mb-2 mt-6 tracking-widest">Manajemen</div>
                    )}
                    {idx === 4 && (
                      <div className="uppercase text-xs font-bold text-blue-200 mb-2 mt-6 tracking-widest">Keuangan</div>
                    )}
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200 ${
                        pathname.startsWith(item.href)
                          ? 'bg-white/20 text-white shadow-md' // Aktif
                          : 'text-blue-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
        {/* Logout Button */}
        <div className="mt-auto">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
} 