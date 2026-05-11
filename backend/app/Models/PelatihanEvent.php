<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['created_by', 'judul', 'penyelenggara', 'jenis', 'topik', 'tanggal_mulai', 'tanggal_selesai', 'triwulan', 'tahun', 'status', 'estimasi_biaya'])]
class PelatihanEvent extends Model
{
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participations()
    {
        return $this->hasMany(PelatihanParticipation::class);
    }
}
