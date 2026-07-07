<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubKkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subKks = [
            ['name' => 'CORES — Control, Automation, Robotics & Embedded', 'code' => 'CORES'],
            ['name' => 'PORSCE — Power System & Energy Conversion', 'code' => 'PORSCE'],
            ['name' => 'BEE — Basic Electronics', 'code' => 'BEE'],
            ['name' => 'COMMET — Communication Network', 'code' => 'COMMET'],
            ['name' => 'COS(PI) — Telecommunication & Signal Processing', 'code' => 'COS(PI)'],
        ];

        foreach ($subKks as $sub) {
            \App\Models\SubKk::updateOrCreate(
                ['code' => $sub['code']],
                $sub
            );
        }
    }
}
