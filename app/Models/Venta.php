<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'Venta';
    public $timestamps = false;
    
    protected $fillable = [
        'fecha',
        'total',
        'empleadoId'
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'total' => 'decimal:2',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'empleadoId');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleVenta::class, 'ventaId');
    }
}
