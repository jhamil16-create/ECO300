<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostosCategoria extends Model
{
    use HasFactory;

    protected $table = 'costos_categoria';
    protected $primaryKey = 'ID_Categoria';
    public $timestamps = false;

    protected $fillable = [
        'ID_Empresa',
        'Nombre_Categoria',
    ];
}
