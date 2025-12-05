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

echo "=== GENERANDO DATASET PARA DEFENSA DE PROYECTO ECO300 ===\n\n";

try {
    DB::beginTransaction();

    // ---------------------------------------------------------
    // 1. EMPRESA Y USUARIO (DEMO)
    // ---------------------------------------------------------
    echo "1. [SETUP] Creando entorno de demostración...\n";
    
    // Crear una empresa nueva para no mezclar con datos sucios
    $nombreEmpresa = 'Muebles Finos S.R.L. (DEMO)';
    $empresa = Empresa::where('Nombre', $nombreEmpresa)->first();
    
    if (!$empresa) {
        $empresa = Empresa::create([
            'Nombre' => $nombreEmpresa,
            'RUC_o_NIT' => '999999001',
            'Ciudad' => 'Santa Cruz de la Sierra'
        ]);
    }
    echo "   ✓ Empresa: {$empresa->Nombre}\n";
    
    $email = 'tribunal@eco300.com';
    $password = '12345678';
    
    $user = User::where('Email', $email)->first();
    if (!$user) {
        $user = User::create([
            'ID_Empresa' => $empresa->ID_Empresa,
            'Nombre' => 'Usuario Defensa',
            'Email' => $email,
            'Hash_Password' => Hash::make($password),
            'Rol' => 'Admin'
        ]);
        echo "   ✓ Usuario creado: $email (Pass: $password)\n";
    } else {
        // Resetear password por si acaso
        $user->update(['Hash_Password' => Hash::make($password)]);
        echo "   ✓ Usuario existente reconfigurado: $email\n";
    }

    // Limpiar datos anteriores de esta empresa para la demo limpia
    echo "   ! Limpiando datos antiguos de la empresa demo...\n";
    // Nota: En un sistema real usaríamos soft deletes o foreign keys cascades, aqui manual
    // Orden inverso de dependencia
    DB::statement("DELETE FROM ventas_detalle WHERE ID_Venta IN (SELECT ID_Venta FROM ventas_cabecera WHERE ID_Empresa = ?)", [$empresa->ID_Empresa]);
    DB::statement("DELETE FROM ventas_cabecera WHERE ID_Empresa = ?", [$empresa->ID_Empresa]);
    DB::statement("DELETE FROM produccion_detalle WHERE ID_Produccion IN (SELECT ID_Produccion FROM produccion_registro WHERE ID_Empresa = ?)", [$empresa->ID_Empresa]);
    DB::statement("DELETE FROM produccion_registro WHERE ID_Empresa = ?", [$empresa->ID_Empresa]);
    DB::statement("DELETE FROM registro_costos WHERE ID_Empresa = ?", [$empresa->ID_Empresa]);
    DB::statement("DELETE FROM inventario WHERE ID_Producto IN (SELECT ID_Producto FROM productos WHERE ID_Empresa = ?)", [$empresa->ID_Empresa]);
    DB::statement("DELETE FROM alerta WHERE ID_Empresa = ?", [$empresa->ID_Empresa]);
    DB::statement("DELETE FROM productos WHERE ID_Empresa = ?", [$empresa->ID_Empresa]);


    // ---------------------------------------------------------
    // 2. PRODUCTOS ESTRATÉGICOS (Para mostrar Alertas)
    // ---------------------------------------------------------
    echo "\n2. [PRODUCTOS] Creando catálogo estratégico...\n";
    
    // Definimos productos con intencionalidad para las alertas
    $catalogo = [
        [
            'nombre' => 'Silla Ejecutiva Ergo', // Producto Estrella
            'precio' => 450, 'costo' => 200, 
            'stock' => 50, 'optimo' => 60, 'reorden' => 15,
            'escenario' => 'NORMAL' 
        ],
        [
            'nombre' => 'Escritorio Gerencial', // Alerta Stock Crítico
            'precio' => 1200, 'costo' => 700, 
            'stock' => 4, 'optimo' => 20, 'reorden' => 5,
            'escenario' => 'CRITICO' // Stock actual < Reorden
        ],
        [
            'nombre' => 'Estante Metálico', // Alerta Stock Agotado
            'precio' => 300, 'costo' => 120, 
            'stock' => 0, 'optimo' => 30, 'reorden' => 8,
            'escenario' => 'AGOTADO'
        ],
        [
            'nombre' => 'Mesa Auxiliar', // Alerta Sobreproducción
            'precio' => 150, 'costo' => 80, 
            'stock' => 200, 'optimo' => 100, 'reorden' => 20,
            'escenario' => 'SOBREPRODUCCION' // Stock >> Optimo
        ],
        [
            'nombre' => 'Silla Visita Básica', // Alerta Tendencia Baja
            'precio' => 180, 'costo' => 100, 
            'stock' => 80, 'optimo' => 100, 'reorden' => 20,
            'escenario' => 'TENDENCIA_BAJA' // Ventas cayendo
        ]
    ];

    $productRefs = [];

    foreach ($catalogo as $item) {
        $prod = Producto::create([
            'ID_Empresa' => $empresa->ID_Empresa,
            'Nombre' => $item['nombre'],
            'Descripcion' => "Producto demo para defensa: " . $item['nombre'],
            'Unidad_Medida' => 'unid'
        ]);

        Inventario::create([
            'ID_Producto' => $prod->ID_Producto,
            'Stock_Actual' => $item['stock'],
            'Nivel_Optimo' => $item['optimo'],
            'Punto_Reorden' => $item['reorden']
        ]);

        $productRefs[$item['escenario']] = [
            'model' => $prod,
            'data' => $item
        ];

        echo "   ✓ {$item['nombre']} -> Escenario: {$item['escenario']}\n";
    }

    // ---------------------------------------------------------
    // 3. COSTOS FIJOS (Dashboard Efficiency)
    // ---------------------------------------------------------
    echo "\n3. [COSTOS] Generando estructura de costos...\n";
    $cats = ['Alquiler Fabrica', 'Sueldos Operarios', 'Luz Industrial', 'Publicidad'];
    $catIds = [];
    
    foreach ($cats as $c) {
        $cat = CostosCategoria::create(['ID_Empresa' => $empresa->ID_Empresa, 'Nombre_Categoria' => $c]);
        $catIds[$c] = $cat->ID_Categoria;
    }

    // Generar 6 meses de costos
    for ($i = 0; $i < 6; $i++) {
        $date = Carbon::now()->subMonths(5-$i)->day(1);
        RegistroCostos::create(['ID_Empresa' => $empresa->ID_Empresa, 'ID_Categoria' => $catIds['Alquiler Fabrica'], 'Fecha' => $date, 'Monto' => 2000]);
        RegistroCostos::create(['ID_Empresa' => $empresa->ID_Empresa, 'ID_Categoria' => $catIds['Sueldos Operarios'], 'Fecha' => $date, 'Monto' => 5000]);
        RegistroCostos::create(['ID_Empresa' => $empresa->ID_Empresa, 'ID_Categoria' => $catIds['Luz Industrial'], 'Fecha' => $date, 'Monto' => 800 + rand(-50, 50)]);
    }

    // ---------------------------------------------------------
    // 4. HISTORIAL TRANSACCIONAL (Ventas vs Producción)
    // ---------------------------------------------------------
    echo "\n4. [TRANSACCIONES] Simulando flujo de 6 meses...\n";
    
    // Meses 0 a 5 (0 es hace 6 meses, 5 es actual)
    for ($m = 0; $m < 6; $m++) {
        $mesFecha = Carbon::now()->subMonths(5-$m);
        echo "   Mes {$mesFecha->format('Y-M')}... ";

        // --- PRODUCCIÓN ---
        // Generamos producción para tener datos en la gráfica purpura
        // Especial énfasis en el mes actual para la KPI card
        $prodRegister = ProduccionRegistro::create([
            'ID_Empresa' => $empresa->ID_Empresa,
            'Fecha' => $mesFecha->copy()->day(10),
            'Costo_Total' => 0 // Se calcula por detalle ahora
        ]);

        foreach ($productRefs as $key => $pInfo) {
            // Producimos un poco de todo para tener stock histórico
            // Si es mes actual, producimos bastante para que se vea bonita la KPI cards
            $qty = ($m == 5) ? rand(50, 80) : rand(20, 40);
            
            ProduccionDetalle::create([
                'ID_Produccion' => $prodRegister->ID_Produccion,
                'ID_Producto' => $pInfo['model']->ID_Producto,
                'Cantidad' => $qty,
                'Costo_Unit' => $pInfo['data']['costo']
            ]);
        }


        // --- VENTAS ---
        // Generamos varias ventas por mes
        $numVentas = rand(8, 15);
        
        for ($v = 0; $v < $numVentas; $v++) {
            $fechaVenta = $mesFecha->copy()->day(rand(1, 28));
            
            $ventaTotal = 0;
            $itemsVenta = [];

            // Elegir productos aleatorios, PERO respetar lógica de Alertas
            foreach ($productRefs as $escenario => $pInfo) {
                
                // Lógica especial para 'TENDENCIA_BAJA': Vender mucho antes, poco ahora
                if ($escenario == 'TENDENCIA_BAJA') {
                    // Mes 0,1,2: Vende mucho (8-10). Mes 3,4,5: Vende poco (1-2)
                    $qty = ($m < 3) ? rand(8, 12) : rand(0, 2);
                } 
                // Logica normal
                else {
                    $qty = rand(1, 5);
                }

                if ($qty > 0) {
                    $precio = $pInfo['data']['precio'];
                    $subtotal = $qty * $precio;
                    $itemsVenta[] = [
                        'prod_id' => $pInfo['model']->ID_Producto,
                        'qty' => $qty,
                        'precio' => $precio,
                        'subtotal' => $subtotal
                    ];
                    $ventaTotal += $subtotal;
                }
            }

            if ($ventaTotal > 0) {
                $ventaHeader = Venta::create([
                    'ID_Empresa' => $empresa->ID_Empresa,
                    'Fecha_Venta' => $fechaVenta,
                    'Total_Venta' => $ventaTotal,
                    'Ticket_Promedio' => $ventaTotal // Simplificado
                ]);

                foreach ($itemsVenta as $item) {
                    VentasDetalle::create([
                        'ID_Venta' => $ventaHeader->ID_Venta,
                        'ID_Producto' => $item['prod_id'],
                        'Cantidad' => $item['qty'],
                        'Precio_Unit' => $item['precio'],
                        'Total' => $item['subtotal']
                    ]);
                }
            }
        }
        echo "OK\n";
    }

    DB::commit();
    echo "\n=== [LISTO] Credenciales para Defensa ===\n";
    echo "URL:      http://127.0.0.1:8000/login\n";
    echo "Email:    $email\n";
    echo "Password: $password\n";
    echo "===========================================\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage();
}
