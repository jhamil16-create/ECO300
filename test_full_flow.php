<?php

use App\Models\User;
use App\Models\Empresa;
use App\Models\Producto;
use App\Models\Inventario;
use App\Models\Venta;
use App\Models\VentasDetalle;
use App\Services\EconomicAnalysisService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- INICIANDO PRUEBA INTEGRAL DEL SISTEMA ---\n";

try {
    DB::beginTransaction();

    // 1. Verificar/Crear Empresa y Usuario
    echo "\n1. [AUTH] Verificando Usuario...\n";
    $empresa = Empresa::firstOrCreate(
        ['Nombre' => 'Empresa Demo'],
        ['RUC_o_NIT' => '999999999', 'Ciudad' => 'Santa Cruz']
    );

    $email = 'admin@eco300.com';
    $password = 'password123';
    
    $user = User::where('email', $email)->first();
    if (!$user) {
        $user = User::create([
            'ID_Empresa' => $empresa->ID_Empresa,
            'Nombre' => 'Admin Demo',
            'email' => $email,
            'password' => Hash::make($password),
            'Rol' => 'Admin'
        ]);
        echo "   -> Usuario creado: $email / $password\n";
    } else {
        // Reset password to ensure we know it
        $user->password = Hash::make($password);
        $user->save();
        echo "   -> Usuario existente actualizado: $email / $password\n";
    }

    // 2. Crear Producto e Inventario
    echo "\n2. [INVENTARIO] Creando Producto de Prueba...\n";
    $producto = Producto::create([
        'ID_Empresa' => $empresa->ID_Empresa,
        'Nombre' => 'Producto Test ' . rand(100, 999),
        'Descripcion' => 'Producto generado automáticamente',
        'Unidad_Medida' => 'Unidad'
    ]);
    
    Inventario::create([
        'ID_Producto' => $producto->ID_Producto,
        'Stock_Actual' => 100,
        'Nivel_Optimo' => 200,
        'Punto_Reorden' => 50
    ]);
    echo "   -> Producto ID: {$producto->ID_Producto} ({$producto->Nombre})\n";

    // 3. Registrar Venta
    echo "\n3. [VENTAS] Registrando Venta...\n";
    $venta = Venta::create([
        'ID_Empresa' => $empresa->ID_Empresa,
        'Fecha_Venta' => Carbon::now(),
        'Total_Venta' => 150.00,
        'Ticket_Promedio' => 150.00
    ]);

    VentasDetalle::create([
        'ID_Venta' => $venta->ID_Venta,
        'ID_Producto' => $producto->ID_Producto,
        'Cantidad' => 10,
        'Precio_Unit' => 15.00,
        'Total' => 150.00
    ]);
    echo "   -> Venta registrada ID: {$venta->ID_Venta} por Bs 150.00\n";

    // 4. Verificar Análisis Económico
    echo "\n4. [ANALYTICS] Verificando Servicio Económico...\n";
    $service = new EconomicAnalysisService();
    $prediction = $service->predictNextMonthDemand($producto->ID_Producto, $empresa->ID_Empresa);
    $rotation = $service->checkInventoryRotation($producto->ID_Producto, $empresa->ID_Empresa);
    
    echo "   -> Predicción Demanda: $prediction\n";
    echo "   -> Rotación Inventario: " . json_encode($rotation) . "\n";

    // Commit para que los datos persistan y podamos probar en el navegador
    DB::commit(); 
    echo "\n--- PRUEBA EXITOSA: DATOS GUARDADOS PARA TESTEO FRONTEND ---\n";
    echo "Credenciales para Login:\n";
    echo "Email: $email\n";
    echo "Password: $password\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\nERROR: " . $e->getMessage() . "\n";
    exit(1);
}
