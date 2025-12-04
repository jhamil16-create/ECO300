<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Empresas', function (Blueprint $table) {
            $table->id('ID_Empresa');
            $table->string('Nombre', 150);
            $table->string('RUC_o_NIT', 20)->unique();
            $table->string('Ciudad', 50)->nullable();
            $table->dateTime('Fecha_Registro')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Empresas');
    }
};
