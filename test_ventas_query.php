<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\VentaCabecera;
use App\Models\VentaDetalle;

echo "Testing VentaCabecera query...\n\n";

$empresaId = 1;

$ventas = VentaCabecera::where('ID_Empresa', $empresaId)
    ->with('detalles.producto')
    ->orderBy('Fecha_Venta', 'desc')
    ->limit(5)
    ->get();

echo "Found " . $ventas->count() . " ventas\n\n";

foreach ($ventas as $venta) {
    echo "Venta ID: {$venta->ID_Venta}\n";
    echo "  Fecha: {$venta->Fecha_Venta}\n";
    echo "  Total: Bs {$venta->Total_Venta}\n";
    echo "  Detalles: " . $venta->detalles->count() . "\n";
    
    foreach ($venta->detalles as $detalle) {
        $productoNombre = $detalle->producto ? $detalle->producto->Nombre : 'N/A';
        echo "    - {$productoNombre}: {$detalle->Cantidad} x Bs {$detalle->Precio_Unit}\n";
    }
    echo "\n";
}
