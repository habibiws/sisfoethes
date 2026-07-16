<x-mail::message>
# Halo {{ $targetUser->name }},

Ini adalah pengingat otomatis dari Sistem Informasi Kelompok Keahlian EEAT.

Kami mengingatkan Anda untuk melengkapi pengisian data Capaian Tridharma untuk tahun ini. Data yang lengkap sangat penting untuk keperluan evaluasi dan laporan kinerja Kelompok Keahlian.

<x-mail::button :url="config('app.frontend_url', 'http://localhost:3000') . '/capaian'">
Lengkapi Capaian Sekarang
</x-mail::button>

Jika Anda sudah melengkapi data, silakan abaikan email ini.

Salam hangat,<br>
{{ $senderUser->name }}<br>
Sistem Informasi KK EEAT
</x-mail::message>
