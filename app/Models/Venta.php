<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'ventas_cabecera';
    protected $primaryKey = 'ID_Venta';
    public $timestamps = false;
    
    protected $fillable = [
        'ID_Empresa',
        'Fecha_Venta',
        'Total_Venta',
        'Ticket_Promedio'
    ];

    protected $casts = [
        'Fecha_Venta' => 'datetime',
        'Total_Venta' => 'decimal:2',
        'Ticket_Promedio' => 'decimal:2',
    ];

    public function detalles()
    {
        return $this->hasMany(VentasDetalle::class, 'ID_Venta', 'ID_Venta');
    }
}
