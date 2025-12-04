<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'Usuarios';
    protected $primaryKey = 'ID_Usuario';
    public $timestamps = false;

    protected $fillable = [
        'ID_Empresa',
        'Nombre',
        'Email',
        'Hash_Password',
        'Rol',
        'remember_token',
    ];

    protected $hidden = [
        'Hash_Password',
        'remember_token',
    ];



    public function getAuthPassword()
    {
        return $this->Hash_Password;
    }

    /**
     * Get the password attribute for authentication.
     */
    public function getPasswordAttribute()
    {
        return $this->Hash_Password;
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'ID_Empresa', 'ID_Empresa');
    }

    protected function casts(): array
    {
        return [
            'Hash_Password' => 'hashed',
        ];
    }
}
