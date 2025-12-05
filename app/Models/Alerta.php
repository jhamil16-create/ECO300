<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alerta extends Model
{
    protected $table = 'alertas';
    protected $primaryKey = 'ID_Alerta';
    public $timestamps = false;

    protected $fillable = [
        'ID_Empresa',
        'Fecha_Hora',
        'Tipo',
        'Categoria',
        'Mensaje',
        'Accion_Recomendada',
        'Leida',
        'Fecha_Leida',
    ];

    protected $casts = [
        'Fecha_Hora' => 'datetime',
        'Fecha_Leida' => 'datetime',
        'Leida' => 'boolean',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'ID_Empresa', 'ID_Empresa');
    }

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'alerta_producto', 'ID_Alerta', 'ID_Producto');
    }
}
