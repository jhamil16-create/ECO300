import { InventoryTable } from '../components/inventory/InventoryTable';
import { InventoryChart } from '../components/dashboard/InventoryChart';
import { inventoryItems, inventoryData } from '../data/mockData';

export function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Gráfico de resumen */}
      <InventoryChart data={inventoryData} />
      
      {/* Tabla detallada */}
      <InventoryTable items={inventoryItems} />
    </div>
  );
}
