<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('Usuario', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
            $table->string('email')->unique()->nullable()->after('name');
        });
        
        // Actualizar usuarios existentes sin email/name para que tengan un valor
        // Esto es solo para usuarios que ya existían antes de la migración
        DB::table('Usuario')
            ->whereNull('email')
            ->update([
                'email' => DB::raw('CONCAT(username, "@example.com")'),
                'name' => DB::raw('username')
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Usuario', function (Blueprint $table) {
            $table->dropColumn(['name', 'email']);
        });
    }
};
