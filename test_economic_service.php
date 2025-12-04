<?php

use App\Models\User;
use App\Models\Empresa;
use App\Models\Producto;
use App\Models\Inventario;
use App\Models\Venta;
use App\Models\VentasDetalle;
use App\Services\EconomicAnalysisService;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Iniciando prueba de EconomicAnalysisService...\n";

try {
    DB::beginTransaction();

    // 1. Crear datos de prueba
    $empresa = Empresa::first();
    if (!$empresa) {
        $empresa = Empresa::create([
            'Nombre' => 'Empresa Test',
            'RUC_o_NIT' => '123456789',
            'Ciudad' => 'Santa Cruz'
        ]);
    }
    $idEmpresa = $empresa->ID_Empresa;

    $producto = Producto::create([
        'ID_Empresa' => $idEmpresa,
        'Nombre' => 'Producto Test ' . rand(1000, 9999),
        'Descripcion' => 'Test',
        'Unidad_Medida' => 'Unidad'
    ]);
    $idProducto = $producto->ID_Producto;

    echo "Producto creado: ID $idProducto\n";

    // Inventario
    Inventario::create([
        'ID_Producto' => $idProducto,
        'Stock_Actual' => 100,
        'Nivel_Optimo' => 150,
        'Punto_Reorden' => 50
    ]);

    // Ventas (para predicción y rotación)
    // Mes anterior
    $venta1 = Venta::create([
        'ID_Empresa' => $idEmpresa,
        'Fecha_Venta' => Carbon::now()->subMonth(),
        'Total_Venta' => 1000,
        'Ticket_Promedio' => 100
    ]);
    VentasDetalle::create([
        'ID_Venta' => $venta1->ID_Venta,
        'ID_Producto' => $idProducto,
        'Cantidad' => 50,
        'Precio_Unit' => 20,
        'Total' => 1000
    ]);

    // Mes actual (para elasticidad)
    $venta2 = Venta::create([
        'ID_Empresa' => $idEmpresa,
        'Fecha_Venta' => Carbon::now(),
        'Total_Venta' => 1200,
        'Ticket_Promedio' => 120
    ]);
    VentasDetalle::create([
        'ID_Venta' => $venta2->ID_Venta,
        'ID_Producto' => $idProducto,
        'Cantidad' => 40, // Menos cantidad, mayor precio
        'Precio_Unit' => 30,
        'Total' => 1200
    ]);

    // 2. Probar Servicio
    $service = new EconomicAnalysisService();

    echo "\n--- Predicción de Demanda ---\n";
    $prediction = $service->predictNextMonthDemand($idProducto, $idEmpresa);
    echo "Predicción: $prediction\n";

    echo "\n--- Rotación de Inventario ---\n";
    $rotation = $service->checkInventoryRotation($idProducto, $idEmpresa);
    print_r($rotation);

    echo "\n--- Punto de Equilibrio ---\n";
    $bep = $service->calculateBreakEvenPoint($idProducto, $idEmpresa);
    echo "BEP: $bep\n";

    echo "\n--- Elasticidad ---\n";
    $elasticity = $service->calculateElasticity($idProducto, $idEmpresa);
    print_r($elasticity);

    DB::rollBack(); // Revertir cambios
    echo "\nPrueba completada exitosamente (Cambios revertidos).\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
