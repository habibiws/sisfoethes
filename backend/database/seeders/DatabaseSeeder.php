<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Sub Kelompok Keahlian
        $this->call([
            SubKkSeeder::class,
        ]);

        // 1. Admin Mutlak (Super Admin) - Tidak bisa mendaftar via web
        User::create([
            'name' => 'Super Admin EEATS',
            'email' => env('ADMIN_EMAIL', 'admin@eeats.com'),
            'password' => \Illuminate\Support\Facades\Hash::make(env('ADMIN_PASSWORD', 'passwordadmin')),
            'role' => 'admin',
        ]);
    }
}
