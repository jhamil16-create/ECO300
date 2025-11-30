import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ProductionData } from '../../types';

interface ProductionChartProps {
  data: ProductionData[];
}

export function ProductionChart({ data }: ProductionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Producción Planificada vs Real</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
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
            <Bar dataKey="planificada" fill="#94a3b8" name="Planificada" radius={[8, 8, 0, 0]} />
            <Bar dataKey="real" fill="#3b82f6" name="Real" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
