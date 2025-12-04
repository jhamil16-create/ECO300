<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('Empleado', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('email')->unique()->nullable();
            $table->string('telefono', 50)->nullable();
            $table->string('cargo', 100)->nullable();
            $table->date('fechaContratacion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Empleado');
    }
};
