<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleVenta extends Model
{
    protected $table = 'DetalleVenta';
    public $timestamps = false;
    
    protected $fillable = [
        'ventaId',
        'productoId',
        'cantidad',
        'precioUnitario'
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precioUnitario' => 'decimal:2',
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class, 'ventaId');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'productoId');
    }
}
