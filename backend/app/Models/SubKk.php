<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'code'])]
class SubKk extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
