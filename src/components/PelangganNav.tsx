import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Zap, FileText, CreditCard, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

const navItems = [
  { href: '/pelanggan/dashboard', label: 'Dashboard', icon: Home },
  { href: '/pelanggan/penggunaan', label: 'Penggunaan', icon: Zap },
  { href: '/pelanggan/tagihan', label: 'Tagihan', icon: FileText },
  { href: '/pelanggan/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { href: '/pelanggan/profile', label: 'Profil', icon: User },
];

export default function PelangganNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }, [router]);

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col bg-gradient-to-b from-blue-500 to-indigo-500 text-white">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <div className="flex h-16 items-center">
            <h1 className="text-xl font-bold tracking-wide">Sistem Listrik</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-150 ${
                        active
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-blue-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Tombol Logout */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white mt-8"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </nav>
        </div>
      </aside>

      {/* Bottom Navbar Mobile/Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 flex justify-around items-center py-2 flex lg:hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-2 py-1 rounded-md transition-all duration-150 ${
                active ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        {/* Tombol Logout di Bottom Navbar */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center px-2 py-1 rounded-md text-gray-600 hover:text-red-600 transition-all duration-150"
        >
          <LogOut className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </nav>
    </>
  );
} 