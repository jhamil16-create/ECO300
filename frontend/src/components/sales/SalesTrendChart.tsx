import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ProductSalesData } from '../../types';

interface SalesTrendChartProps {
  data: ProductSalesData[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Ventas por Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="productoA" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Producto A"
            />
            <Line 
              type="monotone" 
              dataKey="productoB" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Producto B"
            />
            <Line 
              type="monotone" 
              dataKey="productoC" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
              name="Producto C"
            />
            <Line 
              type="monotone" 
              dataKey="productoD" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              name="Producto D"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
