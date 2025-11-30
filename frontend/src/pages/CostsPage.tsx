import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CostPieChart } from '../components/costs/CostPieChart';
import { SupplierTable } from '../components/costs/SupplierTable';
import { costBreakdown, suppliers } from '../data/mockData';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

export function CostsPage() {
  const totalCosts = costBreakdown.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-6">
      {/* Métricas de costos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Costos Totales</p>
                <p className="text-3xl text-gray-900 mb-2">${totalCosts.toLocaleString()}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">+5.2% vs mes anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-100 text-red-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Costo por Unidad</p>
                <p className="text-3xl text-gray-900 mb-2">$12.50</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-600">+3.1% vs mes anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600">
                <Percent className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Margen Promedio</p>
                <p className="text-3xl text-gray-900 mb-2">42.3%</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+1.8% vs mes anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostPieChart data={costBreakdown} />
        
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Inflación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Materia Prima</span>
                  <span className="text-sm text-red-600">+8.2%</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Transporte</span>
                  <span className="text-sm text-orange-600">+6.5%</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Mano de Obra</span>
                  <span className="text-sm text-yellow-600">+4.1%</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '41%' }}></div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Recomendación:</strong> Considere ajustar precios de venta en un 5-7% 
                  para compensar el incremento en costos y mantener márgenes de rentabilidad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de proveedores */}
      <SupplierTable suppliers={suppliers} />
    </div>
  );
}
