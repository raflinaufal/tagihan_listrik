# Sistem Pembayaran Listrik - Manajemen Tagihan Pascabayar

Sistem manajemen pembayaran listrik pascabayar yang modern dengan arsitektur client-server dan kontrol akses berbasis peran (admin dan pelanggan).

## 🚀 Fitur Utama

### Autentikasi & Keamanan
- **Login Multi-Role**: Admin dan pelanggan dapat login dengan akun yang sama
- **Password Hashing**: Menggunakan MD5 untuk keamanan password
- **JWT Token**: Autentikasi berbasis token dengan expiry 24 jam
- **Role-Based Access**: Kontrol akses berdasarkan peran pengguna
- **Session Management**: Cookie HTTP-only yang aman

### Dashboard Admin
- **Statistik Real-time**: Total pelanggan, penggunaan, tagihan, dan pendapatan
- **Manajemen Pelanggan**: CRUD operasi untuk data pelanggan
- **Input Penggunaan**: Tambah data meteran listrik pelanggan
- **Monitoring Tagihan**: Status pembayaran dan pendapatan
- **Analytics**: Grafik dan laporan keuangan

### Dashboard Pelanggan
- **Profil Pelanggan**: Informasi pribadi dan tarif listrik
- **Riwayat Penggunaan**: Data meteran listrik per bulan
- **Status Tagihan**: Riwayat pembayaran dan tagihan yang belum lunas
- **Ringkasan Keuangan**: Total tagihan dan pendapatan

### UI/UX Modern
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Tailwind CSS**: Styling yang konsisten dan modern
- **Radix UI**: Komponen aksesibel dan customizable
- **shadcn/ui**: Komponen UI yang elegan dan reusable
- **Gradient Backgrounds**: Visual yang menarik
- **Hover Effects**: Interaksi yang smooth
- **Loading States**: Feedback visual yang baik

## 🛠️ Teknologi

### Frontend
- **Next.js 15**: React framework dengan App Router
- **TypeScript**: Type safety dan developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **shadcn/ui**: Modern component library
- **Lucide React**: Icon library yang konsisten

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma ORM**: Database abstraction layer
- **MySQL**: Database relasional
- **JWT**: JSON Web Token untuk autentikasi
- **MD5**: Password hashing algorithm

### Database
- **MySQL**: Database utama
- **Prisma Schema**: Type-safe database schema
- **Relations**: Foreign key relationships

## 📊 Struktur Database

```sql
-- Tabel untuk level user (admin)
level (id_level, nama_level)

-- Tabel untuk user admin
user (id_user, username, password, nama_admin, id_level)

-- Tabel untuk tarif listrik
tarif (id_tarif, daya, tarifperkwh)

-- Tabel untuk pelanggan
pelanggan (id_pelanggan, username, password, nomor_kwh, nama_pelanggan, alamat, id_tarif)

-- Tabel untuk penggunaan listrik
penggunaan (id_penggunaan, id_pelanggan, bulan, tahun, meter_awal, meter_ahir)

-- Tabel untuk tagihan
tagihan (id_tagihan, id_penggunaan, id_pelanggan, bulan, tahun, jumlah_meter, status)

-- Tabel untuk pembayaran
pembayaran (id_pembayaran, id_tagihan, id_pelanggan, tanggal_pembayaran, bulan_bayar, biaya_admin, total_bayar, user_id)
```

## 🔧 Instalasi & Setup

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm atau yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd tagihanlistrik
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
# Buat database MySQL
mysql -u root -p
CREATE DATABASE pembayaran_listrik;
```

### 4. Konfigurasi Environment
```bash
# Buat file .env
cp .env.example .env

# Edit .env dengan konfigurasi database
DATABASE_URL="mysql://username:password@localhost:3306/pembayaran_listrik"
JWT_SECRET="your-secret-key-change-this-in-production"
```

### 5. Setup Database Schema
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed database dengan data awal
npx prisma db seed
```

### 6. Jalankan Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 👥 Demo Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `password123`
- **Role**: Administrator
- **Access**: Full system access

### Pelanggan Account
- **Username**: `john_doe`
- **Password**: `password123`
- **Role**: Customer
- **Access**: Personal data and billing

## 🔐 Security Features

### Password Security
- **MD5 Hashing**: Password di-hash menggunakan MD5
- **Salt Protection**: Password tidak disimpan dalam plain text
- **Secure Comparison**: Verifikasi password yang aman

### Authentication
- **JWT Tokens**: Stateless authentication
- **HTTP-Only Cookies**: Token disimpan dalam cookie yang aman
- **Token Expiry**: Auto-logout setelah 24 jam
- **Secure Headers**: Protection against XSS dan CSRF

### Authorization
- **Role-Based Access**: Kontrol akses berdasarkan peran
- **Route Protection**: Halaman terlindungi berdasarkan role
- **API Security**: Endpoint protection dengan middleware

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Layouts**: Grid system yang adaptif
- **Touch-Friendly**: Button dan input yang mudah digunakan di mobile
- **Optimized Images**: Lazy loading dan responsive images

### UI Components
- **Cards**: Informasi yang terorganisir
- **Tables**: Data yang mudah dibaca
- **Forms**: Input yang user-friendly
- **Modals**: Dialog yang responsif
- **Navigation**: Sidebar yang collapsible di mobile

## 🎨 UI/UX Features

### Modern Design
- **Gradient Backgrounds**: Visual yang menarik
- **Shadow Effects**: Depth dan hierarchy
- **Hover Animations**: Interaksi yang smooth
- **Color Coding**: Status dan kategori yang jelas

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels dan semantic HTML
- **Color Contrast**: WCAG compliant color ratios
- **Focus Indicators**: Clear focus states

### Performance
- **Code Splitting**: Lazy loading components
- **Image Optimization**: Next.js Image component
- **Caching**: Static generation dan ISR
- **Bundle Optimization**: Tree shaking dan minification

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login     - Login user
POST /api/auth/logout    - Logout user
```

### Admin APIs
```
GET  /api/admin/stats    - Dashboard statistics
GET  /api/pelanggan      - List all customers
POST /api/pelanggan      - Create customer
PUT  /api/pelanggan      - Update customer
DELETE /api/pelanggan    - Delete customer
```

### Pelanggan APIs
```
GET /api/pelanggan/profile    - Get customer profile
GET /api/pelanggan/penggunaan - Get usage history
GET /api/pelanggan/tagihan    - Get billing history
```

### Data Management
```
GET  /api/penggunaan     - List usage data
POST /api/penggunaan     - Create usage record
GET  /api/tagihan        - List billing data
POST /api/tagihan        - Create billing record
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```bash
# Production environment
NODE_ENV=production
DATABASE_URL="mysql://user:pass@host:3306/db"
JWT_SECRET="your-secure-secret-key"
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 License

MIT License - lihat file LICENSE untuk detail.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**Sistem Pembayaran Listrik** - Manajemen tagihan pascabayar yang modern, aman, dan user-friendly.
