<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'judul', 'sumber_dana', 'posisi', 'nama_pemberi', 'tahun', 'jumlah_dana'])]
class Hibah extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
