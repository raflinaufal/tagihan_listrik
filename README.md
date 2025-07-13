# Sistem Pembayaran Listrik

Sistem manajemen tagihan listrik dengan fitur admin dan pelanggan yang fully responsive menggunakan Next.js, TypeScript, Tailwind CSS, dan Shadcn UI.

## 🚀 Fitur Utama

### Responsive Design
- **Mobile-First Approach**: Layout yang optimal untuk semua ukuran layar
- **Mobile Navigation**: Sidebar yang berubah menjadi slide-out menu di mobile
- **Responsive Tables**: Otomatis berubah menjadi card layout di mobile
- **Adaptive Components**: Semua komponen UI menyesuaikan dengan ukuran layar

### Admin Dashboard
- **Dashboard Analytics**: Statistik real-time dengan grafik dan metrik
- **Manajemen Pelanggan**: CRUD operasi untuk data pelanggan
- **Manajemen Tagihan**: Tracking status pembayaran
- **Manajemen Penggunaan**: Monitoring penggunaan listrik
- **Manajemen Tarif**: Konfigurasi tarif berdasarkan daya

### Pelanggan Portal
- **Dashboard Pelanggan**: View tagihan dan riwayat penggunaan
- **Profile Management**: Update data pribadi
- **Payment History**: Riwayat pembayaran

## 🛠️ Teknologi

- **Frontend**: Next.js 14, TypeScript, React 18
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: Redux Toolkit
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: JWT
- **UI Components**: Radix UI primitives

## 📱 Responsive Components

### AdminLayout
Layout wrapper untuk semua halaman admin dengan sidebar responsive:

```tsx
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminPage() {
  return (
    <AdminLayout onLogout={handleLogout}>
      {/* Content here */}
    </AdminLayout>
  )
}
```

### StatsCard & StatsGrid
Komponen untuk menampilkan statistik dengan responsive design:

```tsx
import { StatsCard, StatsGrid } from '@/components/ui/stats-card'
import { Users, Zap } from 'lucide-react'

<StatsGrid>
  <StatsCard
    title="Total Pelanggan"
    value={pelanggan.length}
    icon={Users}
    iconColor="text-blue-600"
    description="Pelanggan terdaftar"
  />
  <StatsCard
    title="Total Penggunaan"
    value={penggunaan.length}
    icon={Zap}
    iconColor="text-green-600"
    description="Data penggunaan"
  />
</StatsGrid>
```

### SearchFilter
Komponen pencarian dan filter yang responsive:

```tsx
import { SearchFilter } from '@/components/ui/search-filter'

<SearchFilter
  placeholder="Cari pelanggan..."
  value={searchTerm}
  onChange={setSearchTerm}
>
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Tambah Pelanggan
  </Button>
</SearchFilter>
```

### ResponsiveTable
Table yang otomatis berubah menjadi card layout di mobile:

```tsx
import { ResponsiveTable, MobileCardItem, MobileCardBadge } from '@/components/ui/responsive-table'

<ResponsiveTable
  headers={['Nama', 'Alamat', 'No. KWH', 'Daya', 'Tarif', 'Aksi']}
  mobileCardRenderer={() => (
    <>
      {data.map((item) => (
        <MobileCardItem key={item.id}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-medium">{item.nama}</h3>
              <p className="text-sm text-gray-600">{item.alamat}</p>
            </div>
            <div className="flex space-x-2">
              {/* Action buttons */}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <MobileCardBadge>{item.daya} VA</MobileCardBadge>
            <MobileCardBadge variant="outline">{item.tarif}</MobileCardBadge>
          </div>
        </MobileCardItem>
      ))}
    </>
  )}
>
  {/* Desktop table rows */}
</ResponsiveTable>
```

## 📐 Breakpoints

Sistem responsive menggunakan breakpoints Tailwind CSS:

- **Mobile**: `< 640px` - Single column layout, mobile navigation
- **Tablet**: `640px - 1024px` - 2-column grid, compact layout
- **Desktop**: `> 1024px` - Full sidebar, 4-column grid

## 🎨 Design System

### Color Palette
- **Primary**: Blue (`blue-600`) - Main actions, links
- **Success**: Green (`green-600`) - Positive actions, success states
- **Warning**: Orange (`orange-600`) - Alerts, pending items
- **Error**: Red (`red-600`) - Errors, destructive actions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Responsive sizing**: `text-sm` to `text-3xl` based on screen size

### Spacing
- **Mobile**: `p-4`, `gap-4`, `mb-6`
- **Tablet**: `p-6`, `gap-6`, `mb-8`
- **Desktop**: `p-8`, `gap-8`, `mb-8`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL database
- npm or yarn

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd tagihanlistrik
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database credentials
```

4. Setup database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Run development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   ├── pelanggan/         # Customer pages
│   ├── login/             # Auth pages
│   └── api/               # API routes
├── components/
│   ├── admin/             # Admin-specific components
│   │   ├── AdminSidebar.tsx
│   │   └── AdminLayout.tsx
│   └── ui/                # Reusable UI components
│       ├── stats-card.tsx
│       ├── search-filter.tsx
│       └── responsive-table.tsx
├── store/                 # Redux store
├── hooks/                 # Custom hooks
└── lib/                   # Utilities
```

## 🔧 Development

### Adding New Pages
1. Create page in `src/app/admin/` or `src/app/pelanggan/`
2. Use `AdminLayout` wrapper for admin pages
3. Implement responsive design using provided components

### Adding New Components
1. Create component in `src/components/ui/`
2. Follow responsive design patterns
3. Use Tailwind CSS for styling
4. Test on multiple screen sizes

### Database Changes
1. Update Prisma schema in `prisma/schema.prisma`
2. Run `npm run db:generate` to update client
3. Run `npm run db:push` to apply changes

## 📱 Mobile Optimization

### Performance
- Lazy loading untuk komponen besar
- Optimized images dengan Next.js Image
- Minimal bundle size dengan tree shaking

### UX/UI
- Touch-friendly buttons (min 44px)
- Proper spacing untuk touch targets
- Smooth animations dan transitions
- Loading states untuk semua async operations

### Accessibility
- Semantic HTML structure
- ARIA labels untuk screen readers
- Keyboard navigation support
- High contrast mode support

## 🧪 Testing

### Responsive Testing
- Test pada berbagai ukuran layar
- Verify mobile navigation functionality
- Check table-to-card conversion
- Validate touch interactions

### Browser Testing
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach

## 📈 Performance

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization
- Code splitting dengan Next.js
- Image optimization
- Font optimization
- Bundle analysis

## 🔒 Security

- JWT authentication
- Input validation dengan Zod
- SQL injection prevention dengan Prisma
- XSS protection
- CSRF protection

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Follow responsive design guidelines
4. Test on multiple devices
5. Submit pull request

---

**Note**: Sistem ini dirancang dengan mobile-first approach dan fully responsive untuk memberikan pengalaman terbaik di semua perangkat.
