<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'Empleado';
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'telefono',
        'cargo',
        'fechaContratacion'
    ];

    protected $casts = [
        'fechaContratacion' => 'date',
    ];

    public function ventas()
    {
        return $this->hasMany(Venta::class, 'empleadoId');
    }
}
