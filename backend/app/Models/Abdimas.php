<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'judul', 'skema', 'posisi', 'mitra', 'lokasi', 'tahun', 'jumlah_dana'])]
class Abdimas extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
