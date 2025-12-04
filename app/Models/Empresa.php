<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'Empresas';
    protected $primaryKey = 'ID_Empresa';
    public $timestamps = false;

    protected $fillable = [
        'Nombre',
        'RUC_o_NIT',
        'Ciudad',
        'Fecha_Registro'
    ];

    public function usuarios()
    {
        return $this->hasMany(User::class, 'ID_Empresa', 'ID_Empresa');
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'ID_Empresa', 'ID_Empresa');
    }
}

