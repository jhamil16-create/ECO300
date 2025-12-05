<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Empresa;
use App\Models\CostosCategoria;

try {
    echo "Testing database models...\n\n";
    
    // Test 1: Empresa
    $empresa = Empresa::first();
    if (!$empresa) {
        echo "No empresa found. Creating test empresa...\n";
        $empresa = Empresa::create([
            'Nombre' => 'Test Empresa',
            'RUC_o_NIT' => '999999',
            'Ciudad' => 'Santa Cruz'
        ]);
    }
    echo "Empresa: {$empresa->Nombre} (ID: {$empresa->ID_Empresa})\n\n";
    
    // Test 2: CostosCategoria
    echo "Testing CostosCategoria...\n";
    $cat = CostosCategoria::create([
        'ID_Empresa' => $empresa->ID_Empresa,
        'Nombre_Categoria' => 'Test ' . rand(100,999),
        'Tipo_Costo' => 'Fijo',
        'Descripcion' => 'Test category'
    ]);
    echo "Created category: {$cat->Nombre_Categoria}\n";
    
    echo "\n✓ All tests passed!\n";
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
