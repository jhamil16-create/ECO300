import { MetricCard } from '../components/dashboard/MetricCard';
import { SalesTrendChart } from '../components/sales/SalesTrendChart';
import { SalesRegistry } from '../components/sales/SalesRegistry';
import { salesMetrics, productSalesTrend, salesRecords } from '../data/mockData';

export function SalesPage() {
  return (
    <div className="space-y-6">
      {/* Métricas de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salesMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Gráfico de tendencias */}
      <SalesTrendChart data={productSalesTrend} />

      {/* Registro de ventas */}
      <SalesRegistry records={salesRecords} />
    </div>
  );
}