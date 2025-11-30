import { MetricCard } from '../components/dashboard/MetricCard';
import { ProductionChart } from '../components/production/ProductionChart';
import { ProductionRegistry } from '../components/production/ProductionRegistry';
import { productionMetrics, productionComparison, productionRecords } from '../data/mockData';

export function ProductionPage() {
  return (
    <div className="space-y-6">
      {/* Métricas de producción */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productionMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Gráfico de comparación */}
      <ProductionChart data={productionComparison} />

      {/* Registro de producción */}
      <ProductionRegistry records={productionRecords} />
    </div>
  );
}