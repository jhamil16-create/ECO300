<?php

use App\Models\User;
use App\Models\Empresa;
use App\Models\Producto;
use App\Models\Inventario;
use App\Models\Venta;
use App\Models\VentasDetalle;
use App\Models\ProduccionRegistro;
use App\Models\ProduccionDetalle;
use App\Models\RegistroCostos;
use App\Models\CostosCategoria;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== GENERANDO DATOS SIMPLES PARA ECONÓMICOS ===\n\n";

try {
    DB::beginTransaction();

    // 1. Obtener la empresa existente
    echo "1. [SETUP] Obteniendo Empresa y Usuario...\n";
    $empresa = Empresa::first();
    if (!$empresa) {
        throw new Exception("No se encontró ninguna empresa. Por favor ejecuta test_full_flow.php primero.");
    }
    echo "   ✓ Empresa: {$empresa->Nombre} (ID: {$empresa->ID_Empresa})\n";
    
    $user = User::first();
    if (!$user) {
        throw new Exception("No se encontró ningún usuario.");
    }
    echo "   ✓ Usuario: {$user->Email}\n";

    // 2. Obtener productos existentes o crear algunos
    echo "\n2. [PRODUCTOS] Verificando productos...\n";
    $productos = Producto::where('ID_Empresa', $empresa->ID_Empresa)->get();
    
    if ($productos->count() == 0) {
        echo "   Creating sample products...\n";
        for ($i = 1; $i <= 5; $i++) {
            $producto = Producto::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Nombre' => "Producto $i",
                'Descripcion' => "Producto de prueba #$i",
                'Unidad_Medida' => 'kg'
            ]);
            
            Inventario::create([
                'ID_Producto' => $producto->ID_Producto,
                'Stock_Actual' => rand(100, 500),
                'Nivel_Optimo' => rand(200, 600),
                'Punto_Reorden' => rand(50, 150)
            ]);
            
            $productos->push($producto);
        }
    }
    echo "   ✓ Productos disponibles: {$productos->count()}\n";

    // 3. Crear categorías de costos si no existen
    echo "\n3. [COSTOS] Configurando categorías...\n";
    $catData = [
        'Sueldos' => 'Fijo',
        'Alquiler' => 'Fijo',
        'Servicios Basicos' => 'Fijo',
        'Marketing' => 'Fijo',
        'Materia Prima' => 'Variable'
    ];
    
    $categories = [];
    foreach ($catData as $nombre => $tipo) {
        $cat = CostosCategoria::where('ID_Empresa', $empresa->ID_Empresa)
            ->where('Nombre_Categoria', $nombre)
            ->first();
        
        if (!$cat) {
            $cat = CostosCategoria::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Nombre_Categoria' => $nombre,
                'Tipo_Costo' => $tipo,
                'Descripcion' => $nombre
            ]);
        }
        $categories[$nombre] = $cat;
    }
    echo "   ✓ Categorías creadas\n";

    // 4. Generar datos históricos (últimos 6 meses)
    echo "\n4. [HISTÓRICO] Generando datos de 6 meses...\n";
    
    for ($month = 5; $month >= 0; $month--) {
        $monthDate = Carbon::now()->subMonths($month);
        echo "   Mes: {$monthDate->format('Y-m')}\n";
        
        // Costos fijos mensuales
        foreach (['Sueldos' => 8500, 'Alquiler' => 3100, 'Servicios Basicos' => 1000, 'Marketing' => 1000] as $nombre => $monto) {
            RegistroCostos::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'ID_Categoria' => $categories[$nombre]->ID_Categoria,
                'Fecha' => $monthDate->copy()->day(15),
                'Monto' => $monto,
                'Descripcion' => "Costo mensual $nombre"
            ]);
        }
        
        // Ventas para este mes (generamos 20 ventas por mes)
        $ventasCount = 0;
        for ($day = 1; $day <= 20; $day++) {
            $fecha = $monthDate->copy()->day(rand(1, 28))->addHours(rand(8, 20));
            
            // Seleccionar 2-3 productos aleatorios
            $numProds = rand(2, min(3, $productos->count()));
            $prodsVenta = $productos->random($numProds);
            
            $totalVenta = 0;
            $detalles = [];
            
            foreach ($prodsVenta as $prod) {
                $cantidad = rand(1, 8);
                $precio = rand(5, 20) + (rand(0, 99) / 100);
                $subtotal = $cantidad * $precio;
                $totalVenta += $subtotal;
                
                $detalles[] = [
                    'producto_id' => $prod->ID_Producto,
                    'cantidad' => $cantidad,
                    'precio' => round($precio, 2),
                    'total' => round($subtotal, 2)
                ];
            }
            
            $venta = Venta::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Fecha_Venta' => $fecha,
                'Total_Venta' => round($totalVenta, 2),
                'Ticket_Promedio' => round($totalVenta / count($detalles), 2)
            ]);
            
            foreach ($detalles as $det) {
                VentasDetalle::create([
                    'ID_Venta' => $venta->ID_Venta,
                    'ID_Producto' => $det['producto_id'],
                    'Cantidad' => $det['cantidad'],
                    'Precio_Unit' => $det['precio'],
                    'Total' => $det['total']
                ]);
            }
            
            $ventasCount++;
        }
        
        // Producción (2 lotes por mes)
        for ($lote = 1; $lote <= 2; $lote++) {
            $fechaProd = $monthDate->copy()->day(rand(1, 28));
            
            $produccion = ProduccionRegistro::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Fecha' => $fechaProd,
                'Lote' => 'LOTE-' . $monthDate->format('Ym') . '-' . str_pad($lote, 2, '0', STR_PAD_LEFT),
                'Total_Producido' => 0
            ]);
            
            $totalProd = 0;
            $numProds = rand(2, min(4, $productos->count()));
            $prodsLote = $productos->random($numProds);
            
            foreach ($prodsLote as $prod) {
                $cantidad = rand(50, 150);
                $costo = rand(3, 12) + (rand(0, 99) / 100);
                
                ProduccionDetalle::create([
                    'ID_Produccion' => $produccion->ID_Produccion,
                    'ID_Producto' => $prod->ID_Producto,
                    'Cantidad_Producida' => $cantidad,
                    'Costo_Unit' => round($costo, 2),
                    'Total_Costo' => round($cantidad * $costo, 2)
                ]);
                
                $totalProd += $cantidad;
            }
            
            $produccion->Total_Producido = $totalProd;
            $produccion->save();
        }
        
        echo "     ✓ Ventas: $ventasCount | Lotes producción: 2\n";
    }

    DB::commit();
    echo "\n✅ DATOS GENERADOS EXITOSAMENTE\n";
    echo "Puedes probar el EconomicAnalysisService desde el frontend\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ ERROR: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . ":" . $e->getLine() . "\n\n";
    exit(1);
}
