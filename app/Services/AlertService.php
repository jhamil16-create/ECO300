<?php

namespace App\Services;

use App\Models\Alerta;
use App\Models\Producto;
use App\Models\Venta;
use Illuminate\Support\Facades\DB;

class AlertService
{
    public function generateAlerts()
    {
        $this->checkLowStock();
        $this->checkOverproduction();
        $this->checkSalesTrend();
    }

    private function checkLowStock()
    {
        $lowStockProducts = Producto::where('stock', '<', 10)
            ->where('stock', '>', 0)
            ->get();

        foreach ($lowStockProducts as $producto) {
            // Check if alert already exists for this product
            $existingAlert = Alerta::where('tipo', 'Stock Crítico')
                ->where('mensaje', 'LIKE', "%{$producto->nombre}%")
                ->where('fecha', '>=', now()->subDays(1))
                ->first();

            if (!$existingAlert) {
                Alerta::create([
                    'mensaje' => "{$producto->nombre} tiene un stock de {$producto->stock} unidades. Stock crítico.",
                    'tipo' => 'Stock Crítico',
                    'fecha' => now()
                ]);
            }
        }

        // Check for out of stock
        $outOfStock = Producto::where('stock', '=', 0)->get();
        
        foreach ($outOfStock as $producto) {
            $existingAlert = Alerta::where('tipo', 'Stock Agotado')
                ->where('mensaje', 'LIKE', "%{$producto->nombre}%")
                ->where('fecha', '>=', now()->subDays(1))
                ->first();

            if (!$existingAlert) {
                Alerta::create([
                    'mensaje' => "{$producto->nombre} está agotado. Reabastecer urgentemente.",
                    'tipo' => 'Stock Agotado',
                    'fecha' => now()
                ]);
            }
        }
    }

    private function checkOverproduction()
    {
        $productos = Producto::all();

        foreach ($productos as $producto) {
            // Calculate average sales in last 30 days
            $avgSales = DB::table('DetalleVenta')
                ->join('Venta', 'DetalleVenta.ventaId', '=', 'Venta.id')
                ->where('DetalleVenta.productoId', $producto->id)
                ->where('Venta.fecha', '>=', now()->subDays(30))
                ->avg('DetalleVenta.cantidad');

            if ($avgSales && $producto->stock > ($avgSales * 30 * 1.3)) {
                $existingAlert = Alerta::where('tipo', 'Sobreproducción')
                    ->where('mensaje', 'LIKE', "%{$producto->nombre}%")
                    ->where('fecha', '>=', now()->subDays(7))
                    ->first();

                if (!$existingAlert) {
                    $percentage = round((($producto->stock / ($avgSales * 30)) - 1) * 100);
                    Alerta::create([
                        'mensaje' => "El stock de {$producto->nombre} supera en {$percentage}% la demanda promedio. Considerar reducir producción.",
                        'tipo' => 'Sobreproducción',
                        'fecha' => now()
                    ]);
                }
            }
        }
    }

    private function checkSalesTrend()
    {
        $productos = Producto::all();

        foreach ($productos as $producto) {
            // Sales this week
            $thisWeek = DB::table('DetalleVenta')
                ->join('Venta', 'DetalleVenta.ventaId', '=', 'Venta.id')
                ->where('DetalleVenta.productoId', $producto->id)
                ->where('Venta.fecha', '>=', now()->subDays(7))
                ->sum('DetalleVenta.cantidad');

            // Sales last week
            $lastWeek = DB::table('DetalleVenta')
                ->join('Venta', 'DetalleVenta.ventaId', '=', 'Venta.id')
                ->where('DetalleVenta.productoId', $producto->id)
                ->where('Venta.fecha', '>=', now()->subDays(14))
                ->where('Venta.fecha', '<', now()->subDays(7))
                ->sum('DetalleVenta.cantidad');

            if ($lastWeek > 0 && $thisWeek < ($lastWeek * 0.85)) {
                $existingAlert = Alerta::where('tipo', 'Tendencia a la Baja')
                    ->where('mensaje', 'LIKE', "%{$producto->nombre}%")
                    ->where('fecha', '>=', now()->subDays(7))
                    ->first();

                if (!$existingAlert) {
                    $percentage = round((1 - ($thisWeek / $lastWeek)) * 100);
                    Alerta::create([
                        'mensaje' => "La venta de {$producto->nombre} ha caído un {$percentage}% esta semana. Analizar causas.",
                        'tipo' => 'Tendencia a la Baja',
                        'fecha' => now()
                    ]);
                }
            }
        }
    }
}
