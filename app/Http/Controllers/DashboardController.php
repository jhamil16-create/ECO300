<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\VentaCabecera;
use App\Models\Inventario;
use App\Models\Alerta;
use App\Models\Producto;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $empresaId = auth()->user()->ID_Empresa ?? 1; // Por ahora usar empresa 1, luego se puede obtener del usuario autenticado

        // Métricas principales
        $metrics = [
            'monthlySales' => $this->getMonthlySales($empresaId),
            'stockAtRisk' => $this->getStockAtRisk($empresaId),
            'averageCost' => $this->getAverageCost($empresaId),
            'efficiency' => $this->getEfficiency($empresaId),
            'currentProduction' => $this->getCurrentMonthProduction($empresaId),
        ];

        // Datos para gráficos
        $salesData = $this->getSalesChartData($empresaId);
        $inventoryData = $this->getInventoryChartData($empresaId);
        $productionData = $this->getProductionChartData($empresaId);

        // Alertas recientes
        $alerts = Alerta::where('ID_Empresa', $empresaId)
            ->where('Leida', false)
            ->orderBy('Fecha_Hora', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($alerta) {
                return [
                    'ID_Alerta' => $alerta->ID_Alerta,
                    'Mensaje' => $alerta->Mensaje,
                    'Tipo' => $alerta->Tipo,
                    'Categoria' => $alerta->Categoria,
                    'Fecha_Hora' => $alerta->Fecha_Hora,
                    'Accion_Recomendada' => $alerta->Accion_Recomendada,
                ];
            });

        return Inertia::render('Dashboard', [
            'metrics' => $metrics,
            'alerts' => $alerts,
            'salesData' => $salesData,
            'inventoryData' => $inventoryData,
            'productionData' => $productionData,
        ]);
    }

    private function getMonthlySales($empresaId)
    {
        $total = VentaCabecera::where('ID_Empresa', $empresaId)
            ->whereMonth('Fecha_Venta', date('m'))
            ->whereYear('Fecha_Venta', date('Y'))
            ->sum('Total_Venta');

        return $total ?? 0;
    }

    private function getCurrentMonthProduction($empresaId)
    {
        $total = DB::table('produccion_detalle as pd')
            ->join('produccion_registro as pr', 'pd.ID_Produccion', '=', 'pr.ID_Produccion')
            ->where('pr.ID_Empresa', $empresaId)
            ->whereMonth('pr.Fecha', date('m'))
            ->whereYear('pr.Fecha', date('Y'))
            ->sum('pd.Cantidad');

        return $total ?? 0;
    }

    private function getStockAtRisk($empresaId)
    {
        $count = DB::table('inventario as i')
            ->join('productos as p', 'i.ID_Producto', '=', 'p.ID_Producto')
            ->where('p.ID_Empresa', $empresaId)
            ->whereColumn('i.Stock_Actual', '<', 'i.Punto_Reorden')
            ->count();

        return $count;
    }

    private function getAverageCost($empresaId)
    {
        $avg = DB::table('registro_costos')
            ->where('ID_Empresa', $empresaId)
            ->whereMonth('Fecha', date('m'))
            ->whereYear('Fecha', date('Y'))
            ->avg('Monto');

        return round($avg ?? 0, 2);
    }

    private function getEfficiency($empresaId)
    {
        $avg = DB::table('produccion_registro')
            ->where('ID_Empresa', $empresaId)
            ->whereMonth('Fecha', date('m'))
            ->whereYear('Fecha', date('Y'))
            ->avg('Eficiencia');

        return round($avg ?? 92.0, 1);
    }

    private function getSalesChartData($empresaId)
    {
        // Últimos 6 meses de ventas
        $months = [];
        $sales = [];
        $production = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('M');
            
            $monthSales = VentaCabecera::where('ID_Empresa', $empresaId)
                ->whereMonth('Fecha_Venta', $date->month)
                ->whereYear('Fecha_Venta', $date->year)
                ->sum('Total_Venta');
            
            $sales[] = $monthSales ?? 0;

            // Calculate production cost from details since Costo_Total might be null
            $monthProduction = DB::table('produccion_detalle as pd')
                ->join('produccion_registro as pr', 'pd.ID_Produccion', '=', 'pr.ID_Produccion')
                ->where('pr.ID_Empresa', $empresaId)
                ->whereMonth('pr.Fecha', $date->month)
                ->whereYear('pr.Fecha', $date->year)
                ->sum(DB::raw('pd.Cantidad * pd.Costo_Unit'));
            
            $production[] = $monthProduction ?? 0;
        }

        return [
            'labels' => $months,
            'sales' => $sales,
            'production' => $production,
        ];
    }

    private function getInventoryChartData($empresaId)
    {
        $products = Producto::where('ID_Empresa', $empresaId)
            ->with('inventario')
            ->whereHas('inventario', function($q) {
                $q->where('Nivel_Optimo', '>', 0);
            })
            ->limit(5)
            ->get();

        $labels = [];
        $actual = [];
        $optimal = [];

        foreach ($products as $product) {
            $labels[] = $product->Nombre;
            $actual[] = $product->inventario->Stock_Actual ?? 0;
            $optimal[] = $product->inventario->Nivel_Optimo ?? 0;
        }

        return [
            'labels' => $labels,
            'actual' => $actual,
            'optimal' => $optimal,
        ];
    }

    private function getProductionChartData($empresaId)
    {
        // Últimas 4 semanas
        $weeks = [];
        $planned = [];
        $actual = [];

        for ($i = 3; $i >= 0; $i--) {
            $weekStart = Carbon::now()->subWeeks($i)->startOfWeek();
            $weekEnd = Carbon::now()->subWeeks($i)->endOfWeek();
            
            $weeks[] = "Sem " . (4 - $i);
            
            $weekPlanned = DB::table('produccion_planificada')
                ->where('ID_Empresa', $empresaId)
                ->whereBetween('Fecha_Inicio', [$weekStart, $weekEnd])
                ->sum('Cantidad_Planificada');
            
            $planned[] = $weekPlanned ?? 0;

            $weekActual = DB::table('produccion_detalle as pd')
                ->join('produccion_registro as pr', 'pd.ID_Produccion', '=', 'pr.ID_Produccion')
                ->where('pr.ID_Empresa', $empresaId)
                ->whereBetween('pr.Fecha', [$weekStart, $weekEnd])
                ->sum('pd.Cantidad');
            
            $actual[] = $weekActual ?? 0;
        }

        return [
            'labels' => $weeks,
            'planned' => $planned,
            'actual' => $actual,
        ];
    }
}
