# PANDUAN LANGKAH DEMI LANGKAH: MENG-ONLINE-KAN APLIKASI EEAT DENGAN CLOUDFLARE TUNNEL

Panduan ini disusun khusus untuk pemula agar aplikasi **EEAT** yang saat ini berjalan di Docker laptop/server Anda dapat diakses secara online oleh publik menggunakan domain **`kkeeats.com`** tanpa perlu konfigurasi IP Public Statis atau Port Forwarding pada modem.

---

## LANGKAH 1: Hubungkan Domain `kkeeats.com` ke Cloudflare (Gratis)
*Jika Anda sudah menghubungkan domain Anda ke Cloudflare dan statusnya "Active", Anda bisa melewati langkah ini dan langsung menuju ke **Langkah 2**.*

1. Buat akun gratis di [Cloudflare Dashboard](https://dash.cloudflare.com/) jika belum punya.
2. Klik tombol **"Add a site"** di pojok kanan atas dashboard Cloudflare.
3. Masukkan nama domain Anda: `kkeeats.com` dan pilih **Free Plan** (Rp 0 / gratis selamanya).
4. Cloudflare akan memindai DNS record Anda saat ini. Klik **Continue**.
5. Cloudflare akan menampilkan alamat **Nameservers** baru (biasanya ada 2 baris). Contoh:
   * `dan.ns.cloudflare.com`
   * `heather.ns.cloudflare.com`
6. Buka dashboard tempat Anda membeli domain (misal: Niagahoster, Rumahweb, Domainesia, GoDaddy, dll).
7. Cari menu **Ubah Nameservers** / **DNS Management** untuk domain `kkeeats.com` Anda.
8. Ganti nameservers lama dengan nameservers dari Cloudflare yang baru saja Anda dapatkan.
9. Simpan perubahan tersebut. (Proses propagasi nameservers ini membutuhkan waktu sekitar 15 menit hingga maksimal beberapa jam).

---

## LANGKAH 2: Membuat Cloudflare Tunnel di Dashboard Cloudflare
1. Buka dashboard Cloudflare Anda.
2. Di sidebar kiri, klik menu **"Zero Trust"** (jika pertama kali masuk, Anda akan diminta membuat nama organisasi/team gratis).
3. Setelah masuk ke halaman Zero Trust, klik menu **Networks** -> **Tunnels** di sidebar kiri.
4. Klik tombol **"Add a tunnel"** (atau **Create a tunnel**).
5. Pilih tipe tunnel: **Cloudflared** (default), lalu klik **Next**.
6. Beri nama tunnel Anda, misalnya: `eeats-tunnel-prod`, lalu klik **Save tunnel**.
7. Di halaman selanjutnya (**"Install and run a connector"**), Anda akan melihat pilihan sistem operasi. Pilih **Docker**.
8. Di bawah pilihan Docker, akan muncul baris perintah panjang. Contoh perintahnya seperti ini:
   ```bash
   docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token eyJhMm...dan_seterusnya
   ```
9. **PENTING**: Anda hanya membutuhkan bagian tokennya saja (kode acak panjang di akhir perintah).
   * Cari teks setelah `--token` (misalnya: `eyJhMji2...`).
   * **Salin/Copy** seluruh kode token tersebut.

---

## LANGKAH 3: Memasukkan Token ke Proyek Anda
1. Buka file bernama `.env` yang berada di **direktori utama (root) proyek** Anda (jalur file: `d:\Habibi\Project\ETHES\.env`).
2. Tempel/paste token yang sudah Anda salin tadi tepat di sebelah kanan tanda `=` pada baris `CLOUDFLARE_TUNNEL_TOKEN`.
   Contoh pengisian:
   ```env
   CLOUDFLARE_TUNNEL_TOKEN=eyJhMji2...token_panjang_anda_disini...
   ```
3. Simpan/Save file `.env` tersebut.

---

## LANGKAH 4: Mengonfigurasi Rute Domain (Public Hostname)
Kembali ke halaman dashboard Cloudflare Zero Trust (tempat Anda membuat tunnel tadi):

1. Klik tombol **Next** di bagian bawah halaman untuk masuk ke tab **"Route Traffic"** (atau **Public Hostname**).
2. Isi kolom konfigurasi sebagai berikut:
   * **Subdomain**: (Biarkan kosong jika ingin menggunakan domain utama `kkeeats.com`, atau isi `www` jika ingin menggunakan `www.kkeeats.com`).
   * **Domain**: Pilih `kkeeats.com` dari menu dropdown.
   * **Path**: Biarkan kosong.
   * **Type**: Pilih **HTTP** (bukan HTTPS).
   * **URL**: Isi dengan **`frontend:80`** (karena di Docker Compose, container React Nginx kita bernama `frontend` dan berjalan pada port 80).
3. Klik tombol **Save tunnel** (atau **Save hostname**).

---

## LANGKAH 5: Menyalakan Tunnel di Terminal Laptop/Server Anda
Sekarang, mari kita jalankan kontainer tunnel agar terhubung ke Cloudflare:

1. Buka terminal/command prompt di direktori utama proyek (`d:\Habibi\Project\ETHES`).
2. Jalankan perintah ini untuk menyalakan kontainer tunnel:
   ```bash
   docker compose up -d tunnel
   ```
3. Periksa status koneksi dengan melihat log tunnel:
   ```bash
   docker compose logs tunnel
   ```
   *Jika sukses, Anda akan melihat pesan di log terminal yang bertuliskan: `"Connection... registered"* yang berarti kontainer Anda sudah sukses terhubung dengan server Cloudflare.*

---

## SELESAI! UJI COBA APLIKASI
Sekarang aplikasi Anda sudah online! Cobalah akses domain Anda di browser:
* Buka: **`http://kkeeats.com`** atau **`https://kkeeats.com`** (Cloudflare secara otomatis menyediakan sertifikat SSL gratis sehingga situs Anda sudah aman menggunakan HTTPS).

---

### Perintah Penting untuk Diketahui (Cheat Sheet):
* **Mematikan seluruh sistem**: `docker compose down`
* **Menyalakan kembali seluruh sistem**: `docker compose up -d`
* **Melihat log backend**: `docker compose logs backend`
* **Melihat log database**: `docker compose logs db`
