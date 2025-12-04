<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroCostos extends Model
{
    use HasFactory;

    protected $table = 'Registro_Costos';
    protected $primaryKey = 'ID_Costo';
    public $timestamps = false;

    protected $fillable = [
        'ID_Empresa',
        'ID_Categoria',
        'ID_Proveedor',
        'Monto',
        'Fecha',
    ];

    public function categoria()
    {
        return $this->belongsTo(CostosCategoria::class, 'ID_Categoria', 'ID_Categoria');
    }
}
