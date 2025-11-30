import { useState, useEffect } from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { SalesChart } from '../components/dashboard/SalesChart';
import { InventoryChart } from '../components/dashboard/InventoryChart';
import analisisService from '../services/analisisService';
import { Loader2 } from 'lucide-react';

export function DashboardPage() {
  // Verified: No layout duplication here
  const [metricas, setMetricas] = useState<any>(null);
  const [ventasData, setVentasData] = useState<any[]>([]);
  const [inventarioData, setInventarioData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analisisService.getDashboard();

      setMetricas(data.metricas);
      setVentasData(data.ventasPorMes || []);
      setInventarioData(data.inventarioEstado || []);
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError('Error al cargar datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Convert API data to metrics format for MetricCard
  const dashboardMetrics = metricas ? [
    {
      label: 'Ventas del Mes',
      value: `Bs ${metricas.ventasMes?.toFixed(2) || '0.00'}`,
      change: '+12.5%',
      isPositive: true,
      icon: 'trending-up',
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      label: 'Producción Actual',
      value: `${metricas.produccionActual || 0} unid.`,
      change: '-2.3%',
      isPositive: false,
      icon: 'package',
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Costo Promedio',
      value: `Bs ${metricas.costoPromedio?.toFixed(2) || '0.00'}/unid`,
      change: '+3.1%',
      isPositive: true,
      icon: 'dollar-sign',
      iconColor: 'bg-orange-100 text-orange-600'
    },
    {
      label: 'Eficiencia',
      value: `${metricas.eficiencia?.toFixed(1) || '0.0'}%`,
      change: '+2.1%',
      isPositive: true,
      icon: 'check-circle',
      iconColor: 'bg-green-100 text-green-600'
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={ventasData} />
        <InventoryChart data={inventarioData} />
      </div>
    </div>
  );
}
