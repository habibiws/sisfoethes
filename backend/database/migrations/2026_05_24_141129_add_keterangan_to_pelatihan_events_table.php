<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pelatihan_events', function (Blueprint $table) {
            $table->text('keterangan')->nullable()->after('estimasi_biaya');
            $table->string('status')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pelatihan_events', function (Blueprint $table) {
            $table->dropColumn('keterangan');
            $table->enum('status', ['direncanakan', 'terlaksana', 'dibatalkan'])->change();
        });
    }
};
