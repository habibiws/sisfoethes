# 📘 Dokumentasi Teknis Sistem ETHES

> **ETHES** — *Electrical Engineering and Advanced Technologies*  
> Sistem Informasi Kelompok Keahlian, Universitas Telkom Kampus Surabaya

---

## 1. Gambaran Umum

ETHES adalah platform manajemen berbasis web yang digunakan oleh Kelompok Keahlian (KK) untuk mengelola capaian Tridharma dosen secara terpadu. Sistem ini mencakup pencatatan **Publikasi**, **Hibah**, **Paten & HKI**, **Pengabdian Masyarakat (Abdimas)**, serta **Pelatihan & Sertifikasi**.

Sistem menggunakan arsitektur **Decoupled** (Frontend & Backend terpisah) yang terhubung melalui **REST API**, serta menerapkan **Role-Based Access Control (RBAC)** untuk mengatur hak akses pengguna berdasarkan peran.

---

## 2. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | React.js (CRA) | Single Page Application |
| **State** | Zustand | Global state + localStorage persist |
| **Routing** | React Router DOM v7 | Client-side routing |
| **Styling** | Vanilla CSS 3 | Custom Design System (Flexbox/Grid) |
| **Icons** | Lucide React + Custom 3D Icons | Ikon modern & konsisten |
| **Backend** | Laravel 11 (PHP) | RESTful API |
| **Auth** | Laravel Sanctum | Token-based (Bearer Token) |
| **Database** | SQLite (dev) / MySQL (prod) | Portable & zero-config |

---

## 3. Arsitektur Database

Sistem menggunakan **Laravel Migrations** untuk mendefinisikan skema database. Berikut seluruh tabel yang digunakan:

### 3.1 Tabel Inti

| Tabel | Fungsi |
|---|---|
| `users` | Data autentikasi & profil dosen |
| `sub_kks` | Daftar Sub-Kelompok Keahlian |
| `personal_access_tokens` | Manajemen session token (Laravel Sanctum) |

### 3.2 Tabel Capaian (Input Pribadi Dosen)

| Tabel | Fungsi | Kolom Penting |
|---|---|---|
| `publikasis` | Jurnal & Prosiding | `jenis` (enum: scopus, sinta, dsb), `posisi_penulis`, `doi_url` |
| `hibahs` | Hibah Penelitian | `sumber_dana` (internal/eksternal), `posisi`, `jumlah_dana` |
| `patens` | Paten & HKI | `jenis_hki` (paten, hak_cipta, dsb), `status`, `nomor_registrasi` |
| `abdimas` | Pengabdian Masyarakat | `skema`, `mitra`, `lokasi`, `jumlah_dana` |

### 3.3 Tabel Pelatihan (Event-based)

| Tabel | Fungsi | Keterangan |
|---|---|---|
| `pelatihan_events` | Master data event pelatihan | Dibuat oleh Ketua Sub-KK ke atas. Memiliki field `estimasi_biaya`. |
| `pelatihan_participations` | Catatan keikutsertaan dosen | Dosen menandai partisipasinya sendiri. |

### 3.4 Relasi Antar Tabel

```
users (1) ──── (N) publikasis
users (1) ──── (N) hibahs
users (1) ──── (N) patens
users (1) ──── (N) abdimas
users (1) ──── (N) pelatihan_participations
users (1) ──── (N) pelatihan_events          [via created_by]
pelatihan_events (1) ──── (N) pelatihan_participations
users (N) ──── (1) sub_kks
```

### 3.5 Enum Values Reference

**Publikasi - Jenis:**
- `jurnal_internasional_scopus` — Jurnal Internasional Scopus
- `jurnal_nasional_sinta` — Jurnal Nasional SINTA
- `jurnal_nasional_non_sinta` — Jurnal Nasional Non-Index SINTA
- `prosiding_internasional_scopus` — Prosiding Internasional Index Scopus
- `prosiding_nasional` — Prosiding Nasional

**Hibah - Sumber Dana:** `internal`, `eksternal_dn`, `eksternal_ln`

**Paten - Jenis HKI:** `paten`, `paten_sederhana`, `hak_cipta`, `desain_industri`, `merek`

**Paten - Status:** `terdaftar`, `granted`, `dalam_proses`

**Abdimas - Skema:** `mandiri`, `pendanaan_internal`, `pendanaan_eksternal`

**Pelatihan - Jenis:** `workshop`, `sertifikasi`, `pelatihan`, `webinar`, `seminar`

**Pelatihan - Status Event:** `direncanakan`, `terlaksana`, `dibatalkan`

**User - Role:** `admin`, `ketua_kk`, `ketua_sub_kk`, `anggota`

---

## 4. Sistem Hak Akses (Role-Based Access Control)

| Fitur | Admin | Ketua KK | Ketua Sub-KK | Anggota |
|---|:---:|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Profil & Ubah Password | ✅ | ✅ | ✅ | ✅ |
| Input Capaian Pribadi | ❌ | ✅ | ✅ | ✅ |
| Kelola Event Pelatihan (CRUD) | ✅ | ✅ | ✅ | ❌ |
| Tandai Keikutsertaan Pelatihan | ❌ | ✅ | ✅ | ✅ |
| Manajemen User & Role | ✅ | ✅ | ❌ | ❌ |
| Laporan | ✅ | ✅ | ✅ | ✅ |

**Catatan Penting:**
- **Admin** adalah akun bawaan sistem (di-*seed* saat instalasi), tidak bisa dibuat lewat form register. Admin tidak menginput capaian pribadi karena bukan dosen — tugasnya mengelola sistem.
- **Ketua KK** memiliki hak akses setara Admin untuk pengelolaan user, ditambah kemampuan input capaian pribadi.
- **Ketua Sub-KK** dapat membuat dan mengelola event pelatihan di halaman Kelola Pelatihan.
- **Anggota Biasa** hanya menginput capaian dan menandai keikutsertaan pelatihan.

---

## 5. API Endpoints

Semua endpoint (kecuali login, register, dan list sub-kk) dilindungi oleh middleware `auth:sanctum`.

### 5.1 Autentikasi

| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/register` | Registrasi user baru |
| `POST` | `/api/login` | Login & mendapat Bearer Token |
| `POST` | `/api/logout` | Logout & invalidasi token |
| `GET` | `/api/me` | Ambil data user yang sedang login |
| `POST` | `/api/me` | Update profil sendiri |

### 5.2 User Management

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/users` | List semua user |
| `POST` | `/api/users` | Tambah user baru (oleh Admin/Ketua KK) |
| `PUT` | `/api/users/{id}` | Edit data user |
| `POST` | `/api/users/{id}/reset-password` | Reset password user |

### 5.3 Capaian (Publikasi, Hibah, Paten, Abdimas)

Setiap kategori mengikuti pola CRUD yang sama:

| Method | Endpoint Pattern | Fungsi |
|---|---|---|
| `GET` | `/api/{resource}` | List data milik user yang login |
| `POST` | `/api/{resource}` | Tambah data baru |
| `PUT` | `/api/{resource}/{id}` | Edit data |
| `DELETE` | `/api/{resource}/{id}` | Hapus data |

Resource yang tersedia: `publikasis`, `hibahs`, `patens`, `abdimas`

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/capaian/summary` | Ringkasan jumlah per kategori (untuk badge tab) |

### 5.4 Pelatihan

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/pelatihan-events` | List semua event pelatihan |
| `POST` | `/api/pelatihan-events` | Buat event baru |
| `PUT` | `/api/pelatihan-events/{id}` | Edit event |
| `DELETE` | `/api/pelatihan-events/{id}` | Hapus event |
| `GET` | `/api/pelatihan-participations` | List partisipasi user yang login |
| `POST` | `/api/pelatihan-participations` | Tandai keikutsertaan |
| `DELETE` | `/api/pelatihan-participations/{eventId}` | Batalkan keikutsertaan |

> **Catatan Teknis:** Karena PHP built-in server (`php artisan serve`) terkadang bermasalah dengan metode `PUT` dan `DELETE`, frontend menggunakan **method spoofing** yaitu mengirim `POST` request dengan field `_method: 'PUT'` atau `_method: 'DELETE'`.

---

## 6. Arsitektur Frontend

### 6.1 Struktur Folder

```
frontend/src/
├── components/
│   ├── capaian/          # Tab-tab input capaian
│   │   ├── TabPublikasi.js
│   │   ├── TabHibah.js
│   │   ├── TabPaten.js
│   │   ├── TabAbdimas.js
│   │   └── TabPelatihan.js
│   ├── layout/           # Kerangka UI global
│   │   ├── Layout.js
│   │   ├── Sidebar.js
│   │   ├── Navbar.js
│   │   ├── AccessibilityMenu.js
│   │   └── GlobalModal.js    # Sistem notifikasi custom
│   ├── pelatihan/        # Komponen halaman Kelola Pelatihan
│   ├── profil/           # Komponen halaman Profil
│   │   ├── ProfileInfo.js
│   │   ├── ProfileEditForm.js
│   │   └── ProfileSecurity.js
│   └── user-role/        # Komponen manajemen user
│       ├── UserTable.js
│       ├── AddUserModal.js
│       ├── EditUserModal.js
│       └── ResetPasswordModal.js
├── pages/                # Entry-point tiap halaman
│   ├── AuthPage.js       # Login & Register
│   ├── DashboardPage.js
│   ├── CapaianPage.js    # Input Capaian (tab-based)
│   ├── ProfilPage.js
│   ├── PelatihanPage.js  # Kelola Pelatihan
│   ├── UserRolePage.js   # Manajemen User & Role
│   └── LaporanPage.js
├── store/                # Global State (Zustand)
│   ├── authStore.js      # Token, user, login/logout
│   ├── uiStore.js        # Sidebar state, theme, preferences
│   └── modalStore.js     # Alert & Confirm global
├── services/
│   └── api.js            # Axios instance + interceptor
└── styles/               # Design System CSS
```

### 6.2 Fitur UI/UX

- **Pelatihan Redesign:** Halaman Kelola Pelatihan menggunakan layout tabel kompak dengan ringkasan statistik satu baris (horizontal summary bar) untuk efisiensi ruang dan profesionalitas.
- **Modal Popup:** Semua form input capaian dan pelatihan menggunakan modal popup. Jika user keluar tanpa menyimpan, muncul konfirmasi "Buang Perubahan?"
- **Notifikasi Custom:** Sistem menggunakan `GlobalModal` (bukan `window.alert` bawaan browser) untuk semua notifikasi sukses/error/konfirmasi.
- **Aksesibilitas:** Terdapat menu pengaturan ukuran font dan display yang persist di localStorage.
- **Responsive Sidebar:** Sidebar dapat di-collapse/expand, state tersimpan di localStorage.

---

## 7. Keamanan

| Aspek | Implementasi |
|---|---|
| **Kredensial** | File `.env` tidak ter-commit ke Git (ada di `.gitignore`) |
| **Password** | Bcrypt Hash (12 rounds) |
| **API Auth** | Bearer Token via Laravel Sanctum |
| **Route Protection** | `<ProtectedRoute />` di frontend + `auth:sanctum` middleware di backend |
| **Admin Account** | Di-seed dari environment variable, tidak bisa dibuat via register |
| **CORS** | Dikonfigurasi di Laravel untuk menerima request dari frontend |

---

## 8. Sub-Kelompok Keahlian

Berikut adalah Sub-KK yang terdaftar di sistem:

| ID | Nama | Singkatan |
|---|---|---|
| 1 | Control, Automation, Robotics & Embedded | CORES |
| 2 | Power System & Energy Conversion | PORSCE |
| 3 | Basic Electronics | BEE |
| 4 | Communication Network | COMMET |
| 5 | Telecommunication & Signal Processing | COS(PI) |

---

*Dokumen ini merepresentasikan arsitektur sistem ETHES per Mei 2026.*
*Ditulis sebagai referensi teknis untuk pengembangan, handover, dan portofolio.*
