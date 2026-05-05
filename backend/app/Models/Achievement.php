<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'type', 'title', 'date_year', 'role_or_source', 'amount', 'status', 'file_path', 'extra_data'])]
class Achievement extends Model
{
    protected function casts(): array
    {
        return [
            'extra_data' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
