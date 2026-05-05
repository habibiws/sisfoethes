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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'nip')) {
                $table->string('nip')->nullable();
            }
            if (!Schema::hasColumn('users', 'coe')) {
                $table->string('coe')->nullable();
            }
            if (!Schema::hasColumn('users', 'jabatan_fungsional')) {
                $table->string('jabatan_fungsional')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nip', 'coe', 'jabatan_fungsional']);
        });
    }
};
