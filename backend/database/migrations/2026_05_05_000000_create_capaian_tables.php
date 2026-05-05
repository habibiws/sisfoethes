<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publikasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('judul');
            $table->enum('jenis', [
                'jurnal_internasional_scopus',
                'jurnal_nasional_sinta',
                'jurnal_nasional_non_sinta',
                'prosiding_internasional_scopus',
                'prosiding_nasional'
            ]);
            $table->enum('posisi_penulis', ['penulis_pertama', 'corresponding', 'penulis_lainnya']);
            $table->string('nama_jurnal');
            $table->integer('tahun_terbit');
            $table->string('doi_url')->nullable();
            $table->timestamps();
        });

        Schema::create('hibahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('judul');
            $table->enum('sumber_dana', ['internal', 'eksternal_dn', 'eksternal_ln']);
            $table->enum('posisi', ['ketua', 'anggota']);
            $table->string('nama_pemberi');
            $table->integer('tahun');
            $table->decimal('jumlah_dana', 15, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('patens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('judul');
            $table->enum('jenis_hki', ['paten', 'paten_sederhana', 'hak_cipta', 'desain_industri', 'merek']);
            $table->string('nomor_registrasi')->nullable();
            $table->enum('status', ['terdaftar', 'granted', 'dalam_proses']);
            $table->integer('tahun');
            $table->timestamps();
        });

        Schema::create('abdimas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('judul');
            $table->enum('skema', ['mandiri', 'pendanaan_internal', 'pendanaan_eksternal']);
            $table->enum('posisi', ['ketua', 'anggota']);
            $table->string('mitra');
            $table->string('lokasi')->nullable();
            $table->integer('tahun');
            $table->decimal('jumlah_dana', 15, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('pelatihan_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('judul');
            $table->string('penyelenggara');
            $table->enum('jenis', ['workshop', 'sertifikasi', 'pelatihan', 'webinar', 'seminar']);
            $table->string('topik')->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->integer('triwulan');
            $table->integer('tahun');
            $table->enum('status', ['direncanakan', 'terlaksana', 'dibatalkan']);
            $table->timestamps();
        });

        Schema::create('pelatihan_participations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('pelatihan_event_id')->constrained('pelatihan_events')->onDelete('cascade');
            $table->enum('status_keikutsertaan', ['terdaftar', 'hadir', 'tidak_hadir', 'lulus_sertifikasi']);
            $table->string('sertifikat_path')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'pelatihan_event_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelatihan_participations');
        Schema::dropIfExists('pelatihan_events');
        Schema::dropIfExists('abdimas');
        Schema::dropIfExists('patens');
        Schema::dropIfExists('hibahs');
        Schema::dropIfExists('publikasis');
    }
};
