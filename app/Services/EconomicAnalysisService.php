<?php

namespace App\Services;

use App\Models\Venta;
use App\Models\VentasDetalle;
use App\Models\Inventario;
use App\Models\ProduccionDetalle;
use App\Models\RegistroCostos;
use App\Models\CostosCategoria;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EconomicAnalysisService
{
    /**
     * 1. Predicción de Demanda (Regresión Lineal Simple)
     * y = mx + b
     */
    public function predictNextMonthDemand(int $product_id, int $id_empresa)
    {
        // Obtener ventas de los últimos 6 meses agrupadas por mes
        $salesData = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $id_empresa)
            ->where('ventas_detalle.ID_Producto', $product_id)
            ->where('ventas_cabecera.Fecha_Venta', '>=', Carbon::now()->subMonths(6))
            ->select(
                DB::raw('YEAR(ventas_cabecera.Fecha_Venta) as year'),
                DB::raw('MONTH(ventas_cabecera.Fecha_Venta) as month'),
                DB::raw('SUM(ventas_detalle.Cantidad) as total_qty')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        if ($salesData->count() < 2) {
            return 0; // No hay suficientes datos para predecir
        }

        // Preparar datos para regresión (x = índice de mes, y = cantidad)
        $n = $salesData->count();
        $sumX = 0;
        $sumY = 0;
        $sumXY = 0;
        $sumXX = 0;

        $x = 1; // Mes 1, Mes 2, ...
        foreach ($salesData as $data) {
            $y = $data->total_qty;
            
            $sumX += $x;
            $sumY += $y;
            $sumXY += ($x * $y);
            $sumXX += ($x * $x);
            
            $x++;
        }

        // Calcular pendiente (m) y ordenada al origen (b)
        $m = ($n * $sumXY - $sumX * $sumY) / ($n * $sumXX - $sumX * $sumX);
        $b = ($sumY - $m * $sumX) / $n;

        // Predecir para el siguiente mes (x = n + 1)
        $nextMonthX = $n + 1;
        $prediction = $m * $nextMonthX + $b;

        return max(0, round($prediction)); // No devolver valores negativos
    }

    /**
     * 2. Alerta de Riesgo de "Clavos" (Sobre Stock)
     * Días de Inventario = (Inventario Actual / CMV del periodo) * Días del periodo
     */
    public function checkInventoryRotation(int $product_id, int $id_empresa, int $days_threshold = 60)
    {
        $daysPeriod = 90;
        
        // 1. Obtener Inventario Actual
        $inventory = Inventario::where('ID_Producto', $product_id)->first();
        if (!$inventory) {
            return ['days' => 0, 'alert_needed' => false, 'message' => 'Producto no encontrado en inventario'];
        }
        $currentStock = $inventory->Stock_Actual;

        if ($currentStock == 0) {
            return ['days' => 0, 'alert_needed' => false, 'message' => 'Sin stock'];
        }

        // 2. Calcular CMV (Costo Mercancía Vendida) de los últimos 90 días
        // CMV = Suma(Costo_Unit * Cantidad Vendida)
        // Nota: Usamos el costo unitario promedio de producción como aproximación si no tenemos costo histórico por lote en venta
        
        // Primero obtenemos la cantidad vendida en el periodo
        $qtySold = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $id_empresa)
            ->where('ventas_detalle.ID_Producto', $product_id)
            ->where('ventas_cabecera.Fecha_Venta', '>=', Carbon::now()->subDays($daysPeriod))
            ->sum('ventas_detalle.Cantidad');

        if ($qtySold == 0) {
             return [
                'days' => 999, // Infinito técnicamente
                'alert_needed' => true, 
                'recommendation' => 'Producto sin ventas en 90 días. Considerar liquidación.'
            ];
        }

        // Costo unitario promedio de producción (último lote o promedio general)
        $avgCost = ProduccionDetalle::where('ID_Producto', $product_id)
            ->avg('Costo_Unit') ?? 0;

        if ($avgCost == 0) {
             // Fallback si no hay datos de producción: usar precio de venta * 0.6 (estimado)
             $avgPrice = DB::table('ventas_detalle')
                ->where('ID_Producto', $product_id)
                ->avg('Precio_Unit') ?? 0;
             $avgCost = $avgPrice * 0.6;
        }

        $cmv = $qtySold * $avgCost;

        if ($cmv == 0) {
             return ['days' => 0, 'alert_needed' => false, 'message' => 'No se pudo calcular CMV'];
        }

        // Fórmula: (Inventario Actual * Costo Unitario / CMV) * Dias
        // Simplificado: (Stock Actual / Cantidad Vendida) * Dias
        // Ya que Costo Unitario se cancela arriba y abajo si asumimos costo constante
        // Dias Inventario = (Stock Actual / Venta Diaria Promedio)
        
        $dailySales = $qtySold / $daysPeriod;
        $inventoryDays = $currentStock / $dailySales;

        $alertNeeded = $inventoryDays > $days_threshold;
        $excessPct = 0;
        
        if ($alertNeeded) {
            // Calcular exceso porcentual sobre el umbral
            $excessPct = round((($inventoryDays - $days_threshold) / $days_threshold) * 100, 1);
            $recommendation = "Reducir producción/compras un {$excessPct}%. Rotación muy lenta.";
        } else {
            $recommendation = "Rotación saludable.";
        }

        return [
            'days' => round($inventoryDays, 1),
            'alert_needed' => $alertNeeded,
            'recommendation' => $recommendation
        ];
    }

    /**
     * 3. Cálculo del Equilibrio de Mercado (Break-Even Point)
     * Qeq = Costos Fijos / (Precio Unit - Costo Variable Unit)
     */
    public function calculateBreakEvenPoint(int $product_id, int $id_empresa)
    {
        // 1. Costos Fijos Mensuales (Mes Actual)
        // Asumimos que ciertas categorías son fijas: 'Mano de Obra', 'Alquiler', 'Marketing', 'Servicios'
        // Esto debería ser configurable, pero por ahora buscamos por nombre o IDs fijos
        $fixedCategories = ['Mano de Obra', 'Alquiler', 'Marketing', 'Servicios Basicos', 'Sueldos'];
        
        $fixedCosts = DB::table('registro_costos')
            ->join('costos_categoria', 'registro_costos.ID_Categoria', '=', 'costos_categoria.ID_Categoria')
            ->where('registro_costos.ID_Empresa', $id_empresa)
            ->whereIn('costos_categoria.Nombre_Categoria', $fixedCategories)
            ->whereMonth('registro_costos.Fecha', Carbon::now()->month)
            ->whereYear('registro_costos.Fecha', Carbon::now()->year)
            ->sum('registro_costos.Monto');

        // Si no hay costos registrados este mes, usar el mes anterior
        if ($fixedCosts == 0) {
             $fixedCosts = DB::table('registro_costos')
                ->join('costos_categoria', 'registro_costos.ID_Categoria', '=', 'costos_categoria.ID_Categoria')
                ->where('registro_costos.ID_Empresa', $id_empresa)
                ->whereIn('costos_categoria.Nombre_Categoria', $fixedCategories)
                ->whereMonth('registro_costos.Fecha', Carbon::now()->subMonth()->month)
                ->sum('registro_costos.Monto');
        }

        // Si es 0, poner un valor por defecto para evitar división por cero o resultados infinitos
        // O retornar null indicando falta de datos
        if ($fixedCosts == 0) return 0;

        // 2. Precio Unitario Promedio (Último mes)
        $avgPrice = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $id_empresa)
            ->where('ventas_detalle.ID_Producto', $product_id)
            ->where('ventas_cabecera.Fecha_Venta', '>=', Carbon::now()->subMonth())
            ->avg('ventas_detalle.Precio_Unit');

        if (!$avgPrice) return 0;

        // 3. Costo Variable Unitario (Promedio de producción último mes)
        $avgVarCost = DB::table('produccion_detalle')
            ->join('produccion_registro', 'produccion_detalle.ID_Produccion', '=', 'produccion_registro.ID_Produccion')
            ->where('produccion_registro.ID_Empresa', $id_empresa)
            ->where('produccion_detalle.ID_Producto', $product_id)
            ->orderBy('produccion_registro.Fecha', 'desc')
            ->limit(5) // Promedio de los últimos 5 lotes
            ->avg('produccion_detalle.Costo_Unit');
            
        if (!$avgVarCost) {
            // Estimación si no hay datos de producción: 60% del precio
            $avgVarCost = $avgPrice * 0.6;
        }

        $contributionMargin = $avgPrice - $avgVarCost;

        if ($contributionMargin <= 0) {
            return -1; // Imposible alcanzar equilibrio (pierdes dinero por unidad)
        }

        // Como los costos fijos son globales de la empresa, y estamos calculando BEP por producto,
        // deberíamos prorratear los costos fijos o asumir que este es el ÚNICO producto.
        // Para simplificar en este dashboard, asumiremos que queremos saber cuántas unidades de ESTE producto
        // cubrirían TODOS los costos fijos (escenario "producto estrella").
        // O idealmente, prorratear por participación en ventas.
        
        // Opción: Prorrateo simple basado en ventas históricas del producto vs ventas totales
        $totalSales = DB::table('ventas_cabecera')
             ->where('ID_Empresa', $id_empresa)
             ->whereMonth('Fecha_Venta', Carbon::now()->month)
             ->sum('Total_Venta');
             
        $productSales = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $id_empresa)
            ->where('ventas_detalle.ID_Producto', $product_id)
            ->whereMonth('ventas_cabecera.Fecha_Venta', Carbon::now()->month)
            ->sum('ventas_detalle.Total');
            
        $share = ($totalSales > 0) ? ($productSales / $totalSales) : 1; // Si es el único o no hay ventas, asume 100%
        
        $allocatedFixedCosts = $fixedCosts * $share;
        
        $bep = $allocatedFixedCosts / $contributionMargin;

        return round($bep);
    }

    /**
     * 4. Análisis de Elasticidad Precio de la Demanda (EPD)
     * Arc Elasticity = ( (Q2-Q1) / (Q2+Q1)/2 ) / ( (P2-P1) / (P2+P1)/2 )
     */
    public function calculateElasticity(int $product_id, int $id_empresa)
    {
        // Comparar dos periodos recientes (ej. Últimos 30 días vs 30 días anteriores)
        // O agrupar por semanas si hay cambios de precio frecuentes
        
        // Periodo 2 (Más reciente)
        $p2Start = Carbon::now()->subDays(30);
        $p2End = Carbon::now();
        
        $data2 = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $id_empresa)
            ->where('ventas_detalle.ID_Producto', $product_id)
            ->whereBetween('ventas_cabecera.Fecha_Venta', [$p2Start, $p2End])
            ->select(
                DB::raw('SUM(ventas_detalle.Cantidad) as qty'),
                DB::raw('AVG(ventas_detalle.Precio_Unit) as price')
            )
            ->first();
            
        // Periodo 1 (Anterior)
        $p1Start = Carbon::now()->subDays(60);
        $p1End = Carbon::now()->subDays(30);
        
        $data1 = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $id_empresa)
            ->where('ventas_detalle.ID_Producto', $product_id)
            ->whereBetween('ventas_cabecera.Fecha_Venta', [$p1Start, $p1End])
            ->select(
                DB::raw('SUM(ventas_detalle.Cantidad) as qty'),
                DB::raw('AVG(ventas_detalle.Precio_Unit) as price')
            )
            ->first();

        if (!$data1 || !$data2 || $data1->qty == 0 || $data2->qty == 0) {
            return ['coefficient' => 0, 'interpretation' => 'Datos insuficientes'];
        }

        $q1 = $data1->qty;
        $q2 = $data2->qty;
        $p1 = $data1->price;
        $p2 = $data2->price;

        if ($p1 == $p2) {
            return ['coefficient' => 0, 'interpretation' => 'Precio constante (Inelástica)'];
        }

        // Fórmula de Elasticidad Arco
        $numerator = ($q2 - $q1) / (($q2 + $q1) / 2);
        $denominator = ($p2 - $p1) / (($p2 + $p1) / 2);
        
        $elasticity = $numerator / $denominator;
        $absElasticity = abs($elasticity);

        $interpretation = '';
        if ($absElasticity > 1) {
            $interpretation = 'Elástica (Sensible al precio)';
        } elseif ($absElasticity < 1) {
            $interpretation = 'Inelástica (Poco sensible)';
        } else {
            $interpretation = 'Unitaria';
        }

        return [
            'coefficient' => round($elasticity, 2),
            'interpretation' => $interpretation,
            'details' => "P1: $p1, Q1: $q1 -> P2: $p2, Q2: $q2"
        ];
    }

    /**
     * Check for critical stock levels (Stock <= Reorder Point)
     */
    public function checkCriticalStock(int $product_id)
    {
        $inventory = Inventario::where('ID_Producto', $product_id)->first();
        if (!$inventory) return ['alert' => false];

        $reorderPoint = $inventory->Punto_Reorden ?? 10; // Default threshold if null
        
        if ($inventory->Stock_Actual > 0 && $inventory->Stock_Actual <= $reorderPoint) {
            return [
                'alert' => true,
                'message' => "Stock crítico ({$inventory->Stock_Actual}). Reordenar pronto.",
                'recommendation' => "Realizar pedido de reposición."
            ];
        }

        return ['alert' => false];
    }

    /**
     * Check for stockout (Stock == 0)
     */
    public function checkStockout(int $product_id)
    {
        $inventory = Inventario::where('ID_Producto', $product_id)->first();
        if (!$inventory) return ['alert' => false];

        if ($inventory->Stock_Actual <= 0) {
            return [
                'alert' => true,
                'message' => "Stock agotado. No hay unidades disponibles.",
                'recommendation' => "Reponer inventario inmediatamente."
            ];
        }

        return ['alert' => false];
    }

    /**
     * Check for overproduction (Stock > Optimal Level)
     */
    public function checkOverproduction(int $product_id)
    {
        $inventory = Inventario::where('ID_Producto', $product_id)->first();
        if (!$inventory) return ['alert' => false];

        $optimalLevel = $inventory->Nivel_Optimo;
        
        if ($optimalLevel && $inventory->Stock_Actual > $optimalLevel * 1.2) { // 20% buffer
            return [
                'alert' => true,
                'message' => "Sobreproducción detectada ({$inventory->Stock_Actual} vs Óptimo {$optimalLevel}).",
                'recommendation' => "Reducir producción o promover ventas."
            ];
        }

        return ['alert' => false];
    }

    /**
     * Check for downward sales trend (Last 3 months)
     */
    public function checkSalesTrend(int $product_id, int $id_empresa)
    {
        // Get sales count for last 3 months, grouped by month
        $sales = DB::table('ventas_detalle')
            ->join('ventas_cabecera', 'ventas_detalle.ID_Venta', '=', 'ventas_cabecera.ID_Venta')
            ->where('ventas_cabecera.ID_Empresa', $id_empresa)
            ->where('ventas_detalle.ID_Producto', $product_id)
            ->where('ventas_cabecera.Fecha_Venta', '>=', Carbon::now()->subMonths(3))
            ->select(
                DB::raw('YEAR(ventas_cabecera.Fecha_Venta) as year'),
                DB::raw('MONTH(ventas_cabecera.Fecha_Venta) as month'),
                DB::raw('SUM(ventas_detalle.Cantidad) as qty')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        if ($sales->count() < 2) return ['alert' => false];

        // Check if latest month is significantly lower than previous
        $latest = $sales->first()->qty;
        $previous = $sales->skip(1)->first()->qty;

        if ($previous > 0 && $latest < $previous * 0.8) { // 20% drop
            return [
                'alert' => true,
                'message' => "Tendencia a la baja en ventas detectada.",
                'recommendation' => "Revisar precios o estrategia de marketing."
            ];
        }

        return ['alert' => false];
    }
}

