<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'judul', 'jenis', 'posisi_penulis', 'nama_jurnal', 'tahun_terbit', 'doi_url'])]
class Publikasi extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
