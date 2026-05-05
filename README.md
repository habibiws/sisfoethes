# ETHES — Sistem Informasi Kelompok Keahlian

> Platform pencatatan capaian Tridharma dosen untuk KK *Electrical Engineering and Advanced Technologies*, Universitas Telkom Kampus Surabaya.

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-Academic-blue)

---

## ✨ Fitur Utama

- **Input Capaian Pribadi** — Publikasi, Hibah, Paten & HKI, Pengabdian Masyarakat
- **Manajemen Pelatihan** — Event-based system dengan pencatatan keikutsertaan
- **Role-Based Access** — 4 level: Admin, Ketua KK, Ketua Sub-KK, Anggota
- **Manajemen User** — Tambah, edit, reset password oleh Admin/Ketua KK
- **UI Modern** — Custom design system, modal popup, notifikasi custom, responsive sidebar

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, Zustand, React Router 7, Lucide Icons |
| Backend | Laravel 11, Laravel Sanctum |
| Database | SQLite (development) / MySQL (production-ready) |
| Styling | Vanilla CSS 3 (Custom Design System) |

---

## 🚀 Cara Setup & Menjalankan

### Prasyarat

- **PHP** ≥ 8.2 dengan extension `pdo_sqlite`
- **Composer** (PHP package manager)
- **Node.js** ≥ 18 dengan npm
- **Git**

### Langkah 1: Clone Repository

```bash
git clone https://github.com/habibiws/sisfoethes.git
cd sisfoethes
```

### Langkah 2: Setup Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Jalankan migrasi database + seeder akun Admin
php artisan migrate --seed

# Jalankan server backend
php artisan serve
```

> Backend akan berjalan di `http://localhost:8000`

#### ℹ️ Konfigurasi Opsional

Buka file `backend/.env` untuk mengubah kredensial Admin default:

```env
ADMIN_EMAIL=admin@ethes.com
ADMIN_PASSWORD=passwordadmin
```

### Langkah 3: Setup Frontend (React)

Buka terminal baru (jangan tutup terminal backend):

```bash
cd frontend

# Install dependencies
npm install

# Jalankan server frontend
npm start
```

> Frontend akan berjalan di `http://localhost:3000`

### Langkah 4: Akses Aplikasi

Buka browser dan akses `http://localhost:3000`. Anda bisa login menggunakan:

| Akun | Email | Password |
|---|---|---|
| **Admin** | `admin@ethes.com` | `passwordadmin` |

Atau buat akun baru melalui halaman **Daftar**.

---

## 📁 Struktur Proyek

```
sisfoethes/
├── backend/                 # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers
│   │   └── Models/              # Eloquent Models
│   ├── database/
│   │   ├── migrations/          # Skema database
│   │   └── seeders/             # Seed akun Admin
│   └── routes/api.php           # Definisi API routes
│
├── frontend/                # React SPA
│   └── src/
│       ├── components/          # Komponen UI modular
│       ├── pages/               # Halaman-halaman utama
│       ├── store/               # Global state (Zustand)
│       ├── services/api.js      # Axios HTTP client
│       └── styles/              # Design system CSS
│
├── DOKUMENTASI_SISTEM.md    # Dokumentasi teknis lengkap
└── README.md                # File ini
```

---

## 📊 Skema Database

```
users ──────── publikasis        (1:N)
         ├──── hibahs            (1:N)
         ├──── patens            (1:N)
         ├──── abdimas           (1:N)
         ├──── pelatihan_events  (1:N, via created_by)
         └──── pelatihan_participations (1:N)

sub_kks ────── users             (1:N)
pelatihan_events ── pelatihan_participations (1:N)
```

---

## 🔐 Hak Akses (RBAC)

| Fitur | Admin | Ketua KK | Ketua Sub-KK | Anggota |
|---|:---:|:---:|:---:|:---:|
| Input Capaian Pribadi | ❌ | ✅ | ✅ | ✅ |
| Kelola Event Pelatihan | ✅ | ✅ | ✅ | ❌ |
| Manajemen User & Role | ✅ | ✅ | ❌ | ❌ |
| Dashboard & Laporan | ✅ | ✅ | ✅ | ✅ |

---

## 📖 Dokumentasi Lengkap

Untuk dokumentasi teknis yang lebih mendalam (skema database detail, daftar API endpoint, arsitektur frontend, dsb), lihat:

📄 **[DOKUMENTASI_SISTEM.md](DOKUMENTASI_SISTEM.md)**

---

## 📝 Catatan Pengembangan

- Database menggunakan **SQLite** agar portabel dan zero-config. File database (`database.sqlite`) otomatis dibuat saat menjalankan `php artisan migrate`.
- Jika ingin menggunakan **MySQL**, ubah konfigurasi `DB_CONNECTION` di file `.env`.
- Frontend berkomunikasi ke backend melalui `http://localhost:8000/api` (dikonfigurasi di `frontend/src/services/api.js`).

---

*Dikembangkan sebagai Sistem Informasi KK ETHES — Universitas Telkom Kampus Surabaya, 2026.*
