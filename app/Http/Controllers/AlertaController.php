<?php

namespace App\Http\Controllers;

use App\Models\Alerta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlertaController extends Controller
{
    protected $economicService;

    public function __construct(\App\Services\EconomicAnalysisService $economicService)
    {
        $this->economicService = $economicService;
    }

    public function index()
    {
        $empresaId = auth()->user()->ID_Empresa ?? 1;

        // Run analysis for all products to generate alerts
        $productos = \App\Models\Producto::where('ID_Empresa', $empresaId)->get();

        foreach ($productos as $producto) {
            $checks = [
                'Stock Crítico' => $this->economicService->checkCriticalStock($producto->ID_Producto),
                'Stock Agotado' => $this->economicService->checkStockout($producto->ID_Producto),
                'Sobreproducción' => $this->economicService->checkOverproduction($producto->ID_Producto),
                'Tendencia Baja' => $this->economicService->checkSalesTrend($producto->ID_Producto, $empresaId),
            ];

            foreach ($checks as $type => $result) {
                if ($result['alert']) {
                    // Prevent duplicate unread alerts for the same product and type
                    $exists = Alerta::where('ID_Empresa', $empresaId)
                        ->where('Tipo', $type)
                        ->where('Mensaje', 'like', "%{$producto->Nombre}%")
                        ->where('Leida', 0)
                        ->exists();
                    
                    if (!$exists) {
                        Alerta::create([
                            'ID_Empresa' => $empresaId,
                            'Fecha_Hora' => now(),
                            'Tipo' => $type,
                            'Categoria' => 'Inventario',
                            'Mensaje' => "Producto {$producto->Nombre}: " . $result['message'],
                            'Accion_Recomendada' => $result['recommendation'],
                            'Leida' => false
                        ]);
                    }
                }
            }
        }
        
        $alertas = Alerta::where('ID_Empresa', $empresaId)
            ->orderBy('Fecha_Hora', 'desc')
            ->get()
            ->map(function ($alerta) {
                return [
                    'ID_Alerta' => $alerta->ID_Alerta,
                    'Mensaje' => $alerta->Mensaje,
                    'Tipo' => $alerta->Tipo,
                    'Categoria' => $alerta->Categoria,
                    'Fecha_Hora' => $alerta->Fecha_Hora,
                    'Accion_Recomendada' => $alerta->Accion_Recomendada,
                    'Leida' => (bool)$alerta->Leida,
                ];
            });
        
        return Inertia::render('Alertas', [
            'alertas' => $alertas
        ]);
    }

    public function destroy($id)
    {
        $alerta = Alerta::findOrFail($id);
        $alerta->delete();

        return redirect()->back()->with('success', 'Alerta eliminada exitosamente');
    }
}

