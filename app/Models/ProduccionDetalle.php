<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduccionDetalle extends Model
{
    use HasFactory;

    protected $table = 'Produccion_Detalle';
    protected $primaryKey = 'ID_Detalle';
    public $timestamps = false;

    protected $fillable = [
        'ID_Produccion',
        'ID_Producto',
        'Cantidad',
        'Costo_Unit',
    ];

    public function registro()
    {
        return $this->belongsTo(ProduccionRegistro::class, 'ID_Produccion', 'ID_Produccion');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'ID_Producto', 'ID_Producto');
    }
}
