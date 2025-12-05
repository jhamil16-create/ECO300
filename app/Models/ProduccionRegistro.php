<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduccionRegistro extends Model
{
    use HasFactory;

    protected $table = 'produccion_registro';
    protected $primaryKey = 'ID_Produccion';
    public $timestamps = false;

    protected $fillable = [
        'ID_Empresa',
        'Fecha',
        'Costo_Total',
        'Eficiencia',
    ];

    public function detalles()
    {
        return $this->hasMany(ProduccionDetalle::class, 'ID_Produccion', 'ID_Produccion');
    }
}
