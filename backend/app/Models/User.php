<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'nidn', 'prodi', 'sub_kk_id', 'role', 'nip', 'coe', 'jabatan_fungsional'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function subKk()
    {
        return $this->belongsTo(SubKk::class);
    }

    public function achievements()
    {
        return $this->hasMany(Achievement::class);
    }

    public function publikasis()
    {
        return $this->hasMany(Publikasi::class);
    }

    public function hibahs()
    {
        return $this->hasMany(Hibah::class);
    }

    public function patens()
    {
        return $this->hasMany(Paten::class);
    }

    public function abdimas()
    {
        return $this->hasMany(Abdimas::class);
    }

    public function createdPelatihanEvents()
    {
        return $this->hasMany(PelatihanEvent::class, 'created_by');
    }

    public function pelatihanParticipations()
    {
        return $this->hasMany(PelatihanParticipation::class);
    }
}
