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

echo "=== GENERANDO DATOS ECONÓMICOS PARA PRUEBAS ===\n\n";

try {
    DB::beginTransaction();

    // 1. Crear/Obtener Empresa y Usuario
    echo "1. [SETUP] Configurando Empresa y Usuario...\n";
    $empresa = Empresa::where('Nombre', 'FrutasVerduras Santa Cruz')->first();
    
    if (!$empresa) {
        $empresa = Empresa::create([
            'Nombre' => 'FrutasVerduras Santa Cruz',
            'RUC_o_NIT' => '1234567890',
            'Ciudad' => 'Santa Cruz'
        ]);
    }
    echo "   ✓ Empresa: {$empresa->Nombre}\n";
    
    $email = 'admin@eco300.com';
    $password = 'password123';
    
    $user = User::where('Email', $email)->first();
    if (!$user) {
        $user = User::create([
            'ID_Empresa' => $empresa->ID_Empresa,
            'Nombre' => 'Admin Sistema',
            'Email' => $email,
            'Hash_Password' => Hash::make($password),
            'Rol' => 'Admin'
        ]);
        echo "   ✓ Usuario creado: $email / $password\n";
    } else {
        echo "   ✓ Usuario existente: $email\n";
    }

    // 2. Crear Productos
    echo "\n2. [PRODUCTOS] Creando productos diversos...\n";
    
    $productosData = [
        // Frutas
        ['nombre' => 'Manzana', 'precio_base' => 12, 'costo_base' => 7, 'stock' => 250],
        ['nombre' => 'Naranja', 'precio_base' => 10, 'costo_base' => 6, 'stock' => 300],
        ['nombre' => 'Plátano', 'precio_base' => 8, 'costo_base' => 5, 'stock' => 400],
        ['nombre' => 'Uva', 'precio_base' => 25, 'costo_base' => 15, 'stock' => 150],
        ['nombre' => 'Sandía', 'precio_base' => 15, 'costo_base' => 9, 'stock' => 100],
        
        // Verduras
        ['nombre' => 'Tomate', 'precio_base' => 10, 'costo_base' => 6, 'stock' => 350],
        ['nombre' => 'Lechuga', 'precio_base' => 8, 'costo_base' => 5, 'stock' => 200],
        ['nombre' => 'Zanahoria', 'precio_base' => 7, 'costo_base' => 4, 'stock' => 300],
        ['nombre' => 'Cebolla', 'precio_base' => 9, 'costo_base' => 5, 'stock' => 400],
        ['nombre' => 'Papa', 'precio_base' => 6, 'costo_base' => 3.5, 'stock' => 500],
        
        // Hortalizas
        ['nombre' => 'Acelga', 'precio_base' => 5, 'costo_base' => 3, 'stock' => 180],
        ['nombre' => 'Espinaca', 'precio_base' => 7, 'costo_base' => 4, 'stock' => 150]
    ];

    $productos = [];
    foreach ($productosData as $pd) {
        $producto = Producto::create([
            'ID_Empresa' => $empresa->ID_Empresa,
            'Nombre' => $pd['nombre'],
            'Descripcion' => "Producto fresco de alta calidad: " . $pd['nombre'],
            'Unidad_Medida' => 'kg'
        ]);
        
        // Crear inventario
        Inventario::create([
            'ID_Producto' => $producto->ID_Producto,
            'Stock_Actual' => $pd['stock'],
            'Nivel_Optimo' => $pd['stock'] * 1.5,
            'Punto_Reorden' => $pd['stock'] * 0.3
        ]);
        
        $productos[] = [
            'model' => $producto,
            'precio_base' => $pd['precio_base'],
            'costo_base' => $pd['costo_base']
        ];
        
        echo "   ✓ {$producto->Nombre} (Stock: {$pd['stock']} kg)\n";
    }

    // 3. Crear Categorías de Costos (solo campos que existen en BD)
    echo "\n3. [COSTOS] Configurando categorías de costos...\n";
    $costosCategorias = [
        'Mano de Obra',
        'Alquiler',
        'Servicios Basicos',
        'Marketing',
        'Sueldos',
        'Materia Prima',
        'Transporte'
    ];
    
    $costosCategoriasDb = [];
    foreach ($costosCategorias as $nombre) {
        $cat = CostosCategoria::where('ID_Empresa', $empresa->ID_Empresa)
            ->where('Nombre_Categoria', $nombre)
            ->first();
        
        if (!$cat) {
            $cat = CostosCategoria::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Nombre_Categoria' => $nombre
            ]);
        }
        $costosCategoriasDb[$nombre] = $cat;
    }
    echo "   ✓ Categorías de costos creadas\n";

    // 4. Generar datos históricos (últimos 6 meses)
    echo "\n4. [HISTÓRICO] Generando datos de ventas y costos (6 meses)...\n";
    
    $totalVentas = 0;
    $totalProduccion = 0;
    
    // Generar por cada mes
    for ($month = 0; $month < 6; $month++) {
        $monthDate = Carbon::now()->subMonths(5 - $month);
        echo "\n   Mes: " . $monthDate->format('Y-m') . "\n";
        
        // 4.1 Costos Fijos Mensuales (solo campos que existen)
        $costosFijos = [
            'Sueldos' => rand(8000, 9000),
            'Alquiler' => rand(3000, 3200),
            'Servicios Basicos' => rand(800, 1200),
            'Marketing' => rand(500, 1500),
            'Mano de Obra' => rand(2000, 3000)
        ];
        
        foreach ($costosFijos as $nombre => $monto) {
            RegistroCostos::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'ID_Categoria' => $costosCategoriasDb[$nombre]->ID_Categoria,
                'Fecha' => $monthDate->copy()->day(15)->format('Y-m-d'),
                'Monto' => $monto
            ]);
        }
        
        // 4.2 Generar ventas diarias para este mes
        $daysInMonth = $monthDate->daysInMonth;
        $ventasMes = 0;
        
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $fecha = $monthDate->copy()->day($day);
            
            // Skip algunos días aleatoriamente (días sin ventas)
            if (rand(1, 10) <= 2) continue; // 20% de días sin ventas
            
            // Generar entre 5-15 ventas por día
            $numVentas = rand(5, 15);
            
            for ($v = 0; $v < $numVentas; $v++) {
                // Seleccionar productos aleatorios (2-5 productos por venta)
                $numProductos = rand(2, 5);
                $productosVenta = array_rand($productos, $numProductos);
                if (!is_array($productosVenta)) $productosVenta = [$productosVenta];
                
                $totalVenta = 0;
                $detalles = [];
                
                foreach ($productosVenta as $idx) {
                    $p = $productos[$idx];
                    $cantidad = rand(1, 10);
                    
                    // Variación de precio ±10%
                    $precioVariacion = $p['precio_base'] * (1 + (rand(-10, 10) / 100));
                    
                    // Tendencia: los precios suben ligeramente con el tiempo
                    $tendenciaFactor = 1 + ($month * 0.02); // +2% por mes
                    $precio = $precioVariacion * $tendenciaFactor;
                    
                    $subtotal = $cantidad * $precio;
                    $totalVenta += $subtotal;
                    
                    $detalles[] = [
                        'producto' => $p['model'],
                        'cantidad' => $cantidad,
                        'precio' => round($precio, 2),
                        'total' => round($subtotal, 2)
                    ];
                }
                
                // Crear venta
                $venta = Venta::create([
                    'ID_Empresa' => $empresa->ID_Empresa,
                    'Fecha_Venta' => $fecha->copy()->addHours(rand(8, 20))->addMinutes(rand(0, 59)),
                    'Total_Venta' => round($totalVenta, 2),
                    'Ticket_Promedio' => round($totalVenta / count($detalles), 2)
                ]);
                
                // Crear detalles de venta
                foreach ($detalles as $det) {
                    VentasDetalle::create([
                        'ID_Venta' => $venta->ID_Venta,
                        'ID_Producto' => $det['producto']->ID_Producto,
                        'Cantidad' => $det['cantidad'],
                        'Precio_Unit' => $det['precio'],
                        'Total' => $det['total']
                    ]);
                }
                
                $ventasMes += $totalVenta;
            }
        }
        
        // 4.3 Registros de Producción (2-4 lotes por mes) - solo campos que existen
        $numLotes = rand(2, 4);
        for ($l = 0; $l < $numLotes; $l++) {
            $fechaProduccion = $monthDate->copy()->day(rand(1, $daysInMonth));
            
            // Crear registro de producción (solo Fecha, ID_Empresa)
            $produccion = ProduccionRegistro::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Fecha' => $fechaProduccion
            ]);
            
            // Producir 3-6 productos aleatorios por lote
            $numProductosLote = rand(3, 6);
            $productosLote = array_rand($productos, $numProductosLote);
            if (!is_array($productosLote)) $productosLote = [$productosLote];
            
            foreach ($productosLote as $idx) {
                $p = $productos[$idx];
                $cantidadProducida = rand(50, 200);
                $costoUnit = $p['costo_base'] * (1 + (rand(-5, 5) / 100)); // Variación ±5%
                
                // Crear detalle de producción (Cantidad, NO Cantidad_Producida)
                ProduccionDetalle::create([
                    'ID_Produccion' => $produccion->ID_Produccion,
                    'ID_Producto' => $p['model']->ID_Producto,
                    'Cantidad' => $cantidadProducida,
                    'Costo_Unit' => round($costoUnit, 2)
                ]);
                
                $totalProduccion += $cantidadProducida;
            }
        }
        
        echo "     ✓ Ventas: Bs " . number_format($ventasMes, 2) . "\n";
        echo "     ✓ Costos Fijos: Bs " . number_format(array_sum($costosFijos), 2) . "\n";
        
        $totalVentas += $ventasMes;
    }

    // 5. Resumen final
    echo "\n=== RESUMEN DE DATOS GENERADOS ===\n";
    echo "Empresa: {$empresa->Nombre} (ID: {$empresa->ID_Empresa})\n";
    echo "Usuario: $email / $password\n";
    echo "Productos: " . count($productos) . "\n";
    echo "Total Ventas (6 meses): Bs " . number_format($totalVentas, 2) . "\n";
    echo "Total Producción (unidades): " . number_format($totalProduccion, 0) . "\n";
    
    // Estadísticas por producto
    echo "\n=== ESTADÍSTICAS POR PRODUCTO (Últimos 6 meses) ===\n";
    foreach ($productos as $p) {
        $producto = $p['model'];
        $ventasProducto = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $empresa->ID_Empresa)
            ->where('ventas_detalle.ID_Producto', $producto->ID_Producto)
            ->select(
                DB::raw('SUM(ventas_detalle.Cantidad) as total_qty'),
                DB::raw('SUM(ventas_detalle.Total) as total_sales'),
                DB::raw('AVG(ventas_detalle.Precio_Unit) as avg_price')
            )
            ->first();
            
        $inventario = Inventario::where('ID_Producto', $producto->ID_Producto)->first();
        
        echo sprintf(
            "%-15s | Vendidos: %6.0f kg | Ingresos: Bs %8.2f | Precio Prom: Bs %5.2f | Stock: %4.0f kg\n",
            $producto->Nombre,
            $ventasProducto->total_qty ?? 0,
            $ventasProducto->total_sales ?? 0,
            $ventasProducto->avg_price ?? 0,
            $inventario->Stock_Actual ?? 0
        );
    }
    
    DB::commit();
    echo "\n✅ DATOS GENERADOS EXITOSAMENTE\n";
    echo "Ahora puedes probar el EconomicAnalysisService desde el frontend\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ ERROR: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}
