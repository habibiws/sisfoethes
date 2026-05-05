<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'pelatihan_event_id', 'status_keikutsertaan', 'sertifikat_path', 'catatan'])]
class PelatihanParticipation extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(PelatihanEvent::class, 'pelatihan_event_id');
    }
}
