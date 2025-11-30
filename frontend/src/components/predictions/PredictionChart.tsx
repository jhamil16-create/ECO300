import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PredictionData } from '../../types';

interface PredictionChartProps {
  data: PredictionData[];
}

export function PredictionChart({ data }: PredictionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicción de Ventas - Modelo Inteligente</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="ventasReal" fill="#3b82f6" name="Ventas Reales" radius={[8, 8, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="ventasPredicha" 
              stroke="#10b981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', r: 5 }}
              name="Predicción IA"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Análisis:</strong> El modelo predice una tendencia de crecimiento moderado en los próximos meses. 
            La confianza de la predicción disminuye a medida que nos alejamos del presente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
