<?php

namespace App\Http\Controllers;

use App\Services\EconomicAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    protected $economicService;

    public function __construct(EconomicAnalysisService $economicService)
    {
        $this->economicService = $economicService;
    }

    public function getProductAnalysis(Request $request, $productId)
    {
        $user = Auth::user();
        $idEmpresa = $user->ID_Empresa; // Asumiendo que el usuario tiene ID_Empresa

        // 1. Predicción de Demanda
        $demandPrediction = $this->economicService->predictNextMonthDemand($productId, $idEmpresa);

        // 2. Rotación de Inventario
        $inventoryRotation = $this->economicService->checkInventoryRotation($productId, $idEmpresa);

        // 3. Punto de Equilibrio
        $breakEvenPoint = $this->economicService->calculateBreakEvenPoint($productId, $idEmpresa);

        // 4. Elasticidad
        $elasticity = $this->economicService->calculateElasticity($productId, $idEmpresa);

        return response()->json([
            'product_id' => $productId,
            'demand_prediction' => $demandPrediction,
            'inventory_analysis' => $inventoryRotation,
            'break_even_point' => $breakEvenPoint,
            'elasticity' => $elasticity
        ]);
    }
}
