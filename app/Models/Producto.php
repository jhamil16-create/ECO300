<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';
    protected $primaryKey = 'ID_Producto';
    public $timestamps = false;

    protected $fillable = [
        'ID_Empresa',
        'Nombre',
        'Descripcion',
        'Unidad_Medida',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'ID_Empresa', 'ID_Empresa');
    }

    public function inventario()
    {
        return $this->hasOne(Inventario::class, 'ID_Producto', 'ID_Producto');
    }

    public function ventasDetalle()
    {
        return $this->hasMany(VentaDetalle::class, 'ID_Producto', 'ID_Producto');
    }
}
