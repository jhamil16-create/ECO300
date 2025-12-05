<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaCabecera extends Model
{
    protected $table = 'ventas_cabecera';
    protected $primaryKey = 'ID_Venta';
    public $timestamps = false;

    protected $fillable = [
        'ID_Empresa',
        'Fecha_Venta',
        'Total_Venta',
        'Ticket_Promedio',
    ];

    protected $casts = [
        'Total_Venta' => 'decimal:2',
        'Ticket_Promedio' => 'decimal:2',
        'Fecha_Venta' => 'datetime',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'ID_Empresa', 'ID_Empresa');
    }

    public function detalles()
    {
        return $this->hasMany(VentaDetalle::class, 'ID_Venta', 'ID_Venta');
    }
}

