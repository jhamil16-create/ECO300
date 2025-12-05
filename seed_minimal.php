<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Empresa;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\VentasDetalle;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

echo "=== GENERANDO DATOS MÍNIMOS PARA PRUEBAS ===\n\n";

try {
    DB::beginTransaction();

    // 1. Obtener la empresa existente
    $empresa = Empresa::first();
    if (!$empresa) {
        echo "ERROR: No hay empresas. Ejecuta 'php test_full_flow.php' primero\n";
        exit(1);
    }
    echo "Empresa: {$empresa->Nombre}\n";

    // 2. Obtener productos existentes
    $productos = Producto::where('ID_Empresa', $empresa->ID_Empresa)->get();
    if ($productos->count() == 0) {
        echo "ERROR: No hay productos. Ejecuta 'php test_full_flow.php' primero\n";
        exit(1);
    }
    echo "Productos encontrados: {$productos->count()}\n\n";

    // 3. Generar ventas de los últimos 6 meses
    echo "Generando ventas históricas...\n";
    for ($month = 5; $month >= 0; $month--) {
        $monthDate = Carbon::now()->subMonths($month);
        $numVentas = 30; // 30 ventas por mes
        
        for ($i = 0; $i < $numVentas; $i++) {
            $fecha = $monthDate->copy()->day(rand(1, 28))->addHours(rand(8, 20));
            
            // 1-3 productos por venta
            $numProds = rand(1, min(3, $productos->count()));
            $prodsVenta = $productos->random($numProds);
            
            $total = 0;
            $detalles = [];
            
            foreach ($prodsVenta as $prod) {
                $cantidad = rand(1, 10);
                $precio = rand(5, 25);  
                $subtotal = $cantidad * $precio;
                $total += $subtotal;
                
                $detalles[] = [
                    'id' => $prod->ID_Producto,
                    'cant' => $cantidad,
                    'precio' => $precio,
                    'total' => $subtotal
                ];
            }
            
            $venta = Venta::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Fecha_Venta' => $fecha,
                'Total_Venta' => $total,
                'Ticket_Promedio' => $total / count($detalles)
            ]);
            
            foreach ($detalles as $det) {
                VentasDetalle::create([
                    'ID_Venta' => $venta->ID_Venta,
                    'ID_Producto' => $det['id'],
                    'Cantidad' => $det['cant'],
                    'Precio_Unit' => $det['precio'],
                    'Total' => $det['total']
                ]);
            }
        }
        
        echo "  ✓ Mes {{$monthDate->format('Y-m')}}: $numVentas ventas\n";
    }

    DB::commit();
    echo "\n✅ COMPLETADO: " . (6 * 30) . " ventas generadas\n";
    echo "Ahora puedes probar el análisis económico desde el frontend\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ ERROR: " . $e->getMessage() . "\n\n";
    exit(1);
}
