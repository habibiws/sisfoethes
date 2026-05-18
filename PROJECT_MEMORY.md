# 🧠 PROJECT MEMORY & DEVELOPMENT STANDARDS
> **Sistem Informasi Kelompok Keahlian ETHES**  
> File ini adalah memori persisten proyek. Jika Anda berpindah sesi chat, ganti model AI, atau melanjutkan development, **baca file ini terlebih dahulu** untuk menghindari kesalahan berulang dan menjaga konsistensi arsitektur.

---

## 📌 1. STATUS PROYEK SAAT INI (Mei 2026)

*   **Frontend**: React 19 (Port 3000) - Berhasil dimigrasi dari HTML prototype ke komponen dinamis.
*   **Backend**: Laravel 11 (Port 8000) - API berjalan menggunakan database SQLite untuk development.
*   **Modul Pelatihan**: Selesai & Stabil.
*   **Modul Capaian (Dosen)**: Selesai & Stabil (Publikasi, Hibah, Abdimas, Paten).
*   **Modul Laporan**: Direncanakan (Fase 1-4).

---

## ⚠️ 2. ATURAN PENTING & STANDAR CODING (TIDAK BOLEH DIABAIKAN)

Agar aplikasi tetap scalable dan tidak terjadi tabrakan UX (*deadlock*), selalu patuhi standar arsitektur berikut:

### A. Penggunaan Hook `useDirtyState` (Konsistensi Form)
Setiap kali membuat form input dalam modal popup, **wajib** menggunakan hook terpusat `useDirtyState` di `/frontend/src/hooks/useDirtyState.js` untuk melacak perubahan yang belum disimpan.
*   **Pola Penggunaan**:
    ```javascript
    const resetForm = () => { ... };
    const { isDirty, setIsDirty, handleSafeClose } = useDirtyState(resetForm);
    ```
*   **Pola Input**: Semua input form harus menggunakan fungsi penanganan satu pintu (`handleChange`) dan menetapkan `setIsDirty(true)` agar perubahan terlacak dengan benar.
*   **Trigger Penutupan**: Tombol `✕` (Close), tombol `Batal`, dan klik pada `modal-overlay` harus memanggil `handleSafeClose` bukan langsung menutup form.

### B. Arsitektur Modal & Aturan Z-Index (Anti-Deadlock)
Pernah terjadi masalah di mana dialog konfirmasi "Buang Perubahan?" muncul di belakang modal input sehingga aplikasi macet (*stuck*). Aturan Z-Index yang harus dijaga:
1.  **Overlay Form Modal (`modal-overlay`)**: Wajib diatur dengan `zIndex: 10000` (atau maksimal 15000).
2.  **Global Confirmation Modal (`GlobalModal.js`)**: Wajib berada di `zIndex: 20000` ke atas.
3.  Urutan pemanggilan `showConfirm` dari `modalStore` adalah: `showConfirm(message, onConfirm, title, onCancel)`. *Jangan menukar urutan argumen ini karena akan menyebabkan error TypeError.*

### C. Input & Display Nominal Biaya (Estimasi Biaya)
*   **Jangan gunakan singkatan "Juta" atau "jt"** di dalam form input maupun penyimpanan database.
*   **Database & State**: Biarkan nominal disimpan sebagai angka murni (e.g. `15000000`).
*   **Display**: Tampilkan angka tersebut di UI menggunakan format mata uang Indonesia yang bersih:  
    `Rp {parseFloat(value).toLocaleString('id-ID')}` (Hasil: *Rp 15.000.000*).

### D. Otomatisasi Input Form (Anti-Ribet)
*   **Triwulan & Tahun Pelatihan**: Dihitung otomatis oleh sistem di latar belakang berbasis `tanggal_mulai`. Kolom input manual untuk Triwulan, Tahun, dan Status Pelaksanaan (pada form tambah) **dihilangkan** dari UI agar form ringkas.
*   **Validasi Tanggal**: Input `tanggal_selesai` pada form wajib dipasang batasan `min={formData.tanggal_mulai}` agar user tidak bisa memilih tanggal selesai yang mendahului tanggal mulai.
*   **Penyederhanaan Status**: Tidak ada opsi status "Dibatalkan" pada event pelatihan. Jika event batal, user cukup menghapusnya (data partisipasi otomatis ikut terhapus).

### E. Kompatibilitas Request Backend (Spoofing Method)
Karena PHP built-in server (`php artisan serve`) kadang mengalami masalah dalam menangani request HTTP `PUT` dan `DELETE` langsung dari Axios, selalu gunakan **method spoofing** saat mengirim data ke API backend:
*   Kirim request sebagai `POST`.
*   Masukkan field `_method: 'PUT'` atau `_method: 'DELETE'` di dalam body data yang dikirim.

---

## 📋 3. REKAP RIWAYAT EKSEKUSI PER SESI

### Sesi: Perbaikan UI/UX Pelatihan & Standardisasi Capaian
*   **Tanggal**: 11-12 Mei 2026
*   **Perubahan**:
    1.  Membuat hook `useDirtyState` dan menerapkannya di seluruh tab modul Capaian (Publikasi, Hibah, Abdimas, Paten).
    2.  Memperbaiki Z-Index `GlobalModal` ke `20000` dan `PelatihanFormModal` ke `10000`.
    3.  Memperbaiki eror "Ya, Lanjutkan" dengan menyelaraskan parameter `showConfirm`.
    4.  Menghapus input manual Triwulan & Tahun, menggantinya dengan auto-calculation.
    5.  Menambahkan filter Tahun di halaman Pelatihan.
    6.  Memperbaiki `.gitignore` global yang sebelumnya salah memblokir file `index.html` React.
    7.  Memperbaiki input "Judul Artikel" di Tab Publikasi yang tidak bisa diisi.
    8.  Menghapus format "(Juta)" dan emoji dropdown pada status pelaksanaan event.

---

## 🚀 4. AGENDA BERIKUTNYA (YANG HARUS DIKERJAKAN)

Jika sesi chat baru dimulai, langsung arahkan AI untuk melanjutkan pengerjaan **Modul Laporan & Distribusi Capaian** dengan urutan fase berikut:

*   **Fase 1: Backend API Laporan**  
    Buat `LaporanController` dengan endpoint `/api/laporan/rekap` (mengembalikan ringkasan total capaian seluruh dosen) dan `/api/laporan/detail/{userId}` (mengembalikan list capaian detail read-only per dosen).
*   **Fase 2: Integrasi UI Frontend**  
    Hubungkan `LaporanStats.js`, `LaporanFilter.js`, dan `LaporanTable.js` ke API baru tersebut. Hapus data dummy hardcoded.
*   **Fase 3: Modal Rincian Capaian**  
    Buat modal popup detail per dosen (`LaporanDetailModal.js`) dengan format tab read-only untuk Publikasi, Hibah, Abdimas, Paten, dan Pelatihan.
*   **Fase 4: Export Data**  
    Aktifkan fitur Export Excel di sisi client dan atur CSS `@media print` agar halaman laporan rapi saat dicetak.
