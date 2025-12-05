<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\VentaCabecera;
use App\Models\Empresa;

echo "Checking user and ventas...\n\n";

$user = User::where('Email', 'admin@eco300.com')->first();

if ($user) {
    echo "User: {$user->Nombre}\n";
    echo "Empresa ID: {$user->ID_Empresa}\n";
    
    $empresa = Empresa::find($user->ID_Empresa);
    if ($empresa) {
        echo "Empresa: {$empresa->Nombre}\n";
    }
    
    $ventasCount = VentaCabecera::where('ID_Empresa', $user->ID_Empresa)->count();
    echo "Ventas for this empresa: $ventasCount\n\n";
    
    if ($ventasCount > 0) {
        echo "Sample ventas:\n";
        $ventas = VentaCabecera::where('ID_Empresa', $user->ID_Empresa)
            ->orderBy('Fecha_Venta', 'desc')
            ->limit(3)
            ->get();
        
        foreach ($ventas as $venta) {
            echo "  - ID: {$venta->ID_Venta}, Fecha: {$venta->Fecha_Venta}, Total: Bs {$venta->Total_Venta}\n";
        }
    }
} else {
    echo "User not found!\n";
}

// Check all empresas with ventas
echo "\nAll empresas with ventas:\n";
$empresasConVentas = VentaCabecera::select('ID_Empresa')
    ->groupBy('ID_Empresa')
    ->get();

foreach ($empresasConVentas as $ev) {
    $count = VentaCabecera::where('ID_Empresa', $ev->ID_Empresa)->count();
    $empresa = Empresa::find($ev->ID_Empresa);
    $nombreEmpresa = $empresa ? $empresa->Nombre : "ID {$ev->ID_Empresa}";
    echo "  - Empresa: $nombreEmpresa (ID: {$ev->ID_Empresa}) - Ventas: $count\n";
}
