<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Empresa;

echo "Updating user empresa...\n\n";

$user = User::where('Email', 'admin@eco300.com')->first();
$empresa = Empresa::where('Nombre', 'FrutasVerduras Santa Cruz')->first();

if ($user && $empresa) {
    echo "User: {$user->Nombre} (Current Empresa ID: {$user->ID_Empresa})\n";
    echo "Target Empresa: {$empresa->Nombre} (ID: {$empresa->ID_Empresa})\n";
    
    $user->ID_Empresa = $empresa->ID_Empresa;
    $user->save();
    
    echo "\n✅ User updated successfully!\n";
    echo "User now belongs to: {$empresa->Nombre}\n";
} else {
    echo "❌ User or Empresa not found!\n";
}
