<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    protected $table = 'Ventas_Detalle';
    protected $primaryKey = 'ID_Detalle';
    public $timestamps = false;

    protected $fillable = [
        'ID_Venta',
        'ID_Producto',
        'Cantidad',
        'Precio_Unit',
        'Total',
    ];

    protected $casts = [
        'Precio_Unit' => 'decimal:2',
        'Total' => 'decimal:2',
    ];

    public function venta()
    {
        return $this->belongsTo(VentaCabecera::class, 'ID_Venta', 'ID_Venta');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'ID_Producto', 'ID_Producto');
    }
}

