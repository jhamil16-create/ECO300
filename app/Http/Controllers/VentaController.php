<?php

namespace App\Http\Controllers;

use App\Models\VentaCabecera;
use App\Models\VentaDetalle;
use App\Models\Producto;
use App\Models\Inventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VentaController extends Controller
{
    public function index()
    {
        $empresaId = auth()->user()?->ID_Empresa ?? 1;
        
        try {
            $ventas = VentaCabecera::where('ID_Empresa', $empresaId)
                ->with('detalles.producto')
                ->orderBy('Fecha_Venta', 'desc')
                ->limit(50)
                ->get()
                ->map(function ($venta) {
                    return [
                        'ID_Venta' => $venta->ID_Venta,
                        'Fecha_Venta' => $venta->Fecha_Venta,
                        'Total_Venta' => (float) $venta->Total_Venta,
                        'Ticket_Promedio' => (float) $venta->Ticket_Promedio,
                        'detalles' => $venta->detalles->map(function ($detalle) {
                            return [
                                'ID_Detalle' => $detalle->ID_Detalle,
                                'producto' => $detalle->producto ? [
                                    'ID_Producto' => $detalle->producto->ID_Producto,
                                    'Nombre' => $detalle->producto->Nombre,
                                ] : null,
                                'Cantidad' => $detalle->Cantidad,
                                'Precio_Unit' => (float) $detalle->Precio_Unit,
                                'Total' => (float) $detalle->Total,
                            ];
                        }),
                    ];
                });
            
            $productos = Producto::where('ID_Empresa', $empresaId)
                ->with('inventario')
                ->whereHas('inventario', function($query) {
                    $query->where('Stock_Actual', '>', 0);
                })
                ->get()
                ->map(function ($producto) {
                    return [
                        'ID_Producto' => $producto->ID_Producto,
                        'Nombre' => $producto->Nombre,
                        'Stock_Actual' => $producto->inventario->Stock_Actual ?? 0,
                    ];
                });
            
            return Inertia::render('Ventas', [
                'ventas' => $ventas,
                'productos' => $productos
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Ventas', [
                'ventas' => [],
                'productos' => [],
                'error' => 'Error cargando ventas: ' . $e->getMessage()
            ]);
        }
    }

    public function store(Request $request)
    {
        $empresaId = auth()->user()->ID_Empresa ?? 1;
        
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.ID_Producto' => 'required|exists:productos,ID_Producto',
            'items.*.Cantidad' => 'required|integer|min:1',
            'items.*.Precio_Unit' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        
        try {
            $total = 0;
            $detalles = [];

            // Calculate total and prepare details
            foreach ($validated['items'] as $item) {
                $producto = Producto::findOrFail($item['ID_Producto']);
                $inventario = Inventario::where('ID_Producto', $producto->ID_Producto)->first();
                
                // Check stock
                if (!$inventario || $inventario->Stock_Actual < $item['Cantidad']) {
                    throw new \Exception("Stock insuficiente para {$producto->Nombre}");
                }
                
                $subtotal = $item['Precio_Unit'] * $item['Cantidad'];
                $total += $subtotal;
                
                $detalles[] = [
                    'ID_Producto' => $producto->ID_Producto,
                    'Cantidad' => $item['Cantidad'],
                    'Precio_Unit' => $item['Precio_Unit'],
                    'Total' => $subtotal,
                ];
                
                // Update stock
                $inventario->decrement('Stock_Actual', $item['Cantidad']);
            }

            // Create sale header
            $venta = VentaCabecera::create([
                'ID_Empresa' => $empresaId,
                'Fecha_Venta' => now(),
                'Total_Venta' => $total,
                'Ticket_Promedio' => $total / count($detalles),
            ]);

            // Create sale details
            foreach ($detalles as $detalle) {
                VentaDetalle::create([
                    'ID_Venta' => $venta->ID_Venta,
                    'ID_Producto' => $detalle['ID_Producto'],
                    'Cantidad' => $detalle['Cantidad'],
                    'Precio_Unit' => $detalle['Precio_Unit'],
                    'Total' => $detalle['Total'],
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Venta registrada exitosamente');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
