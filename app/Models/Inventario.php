<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table = 'Inventario';
    protected $primaryKey = 'ID_Inventario';
    public $timestamps = false;

    protected $fillable = [
        'ID_Producto',
        'Stock_Actual',
        'Nivel_Optimo',
        'Punto_Reorden',
        'Fecha_Ultima_Act',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'ID_Producto', 'ID_Producto');
    }
}

