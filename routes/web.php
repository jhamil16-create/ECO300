<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Inventory Management
    Route::get('/inventario', [App\Http\Controllers\ProductoController::class, 'index'])->name('inventario.index');
    Route::post('/productos', [App\Http\Controllers\ProductoController::class, 'store'])->name('productos.store');
    Route::patch('/productos/{id}', [App\Http\Controllers\ProductoController::class, 'update'])->name('productos.update');
    Route::delete('/productos/{id}', [App\Http\Controllers\ProductoController::class, 'destroy'])->name('productos.destroy');
    
    Route::post('/categorias', [App\Http\Controllers\CategoriaController::class, 'store'])->name('categorias.store');
    Route::patch('/categorias/{id}', [App\Http\Controllers\CategoriaController::class, 'update'])->name('categorias.update');
    Route::delete('/categorias/{id}', [App\Http\Controllers\CategoriaController::class, 'destroy'])->name('categorias.destroy');
    
    // Sales Management
    Route::get('/ventas', [App\Http\Controllers\VentaController::class, 'index'])->name('ventas.index');
    Route::post('/ventas', [App\Http\Controllers\VentaController::class, 'store'])->name('ventas.store');
    

    
    // Alerts Management
    Route::get('/alertas', [App\Http\Controllers\AlertaController::class, 'index'])->name('alertas.index');
    Route::delete('/alertas/{id}', [App\Http\Controllers\AlertaController::class, 'destroy'])->name('alertas.destroy');
});

require __DIR__.'/auth.php';
