import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SalesData } from '../../types';

interface SalesChartProps {
    data: SalesData[];
}

export function SalesChart({ data }: SalesChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ventas vs Producción</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="colorProduccion" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
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
                        <Area
                            type="monotone"
                            dataKey="ventas"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#colorVentas)"
                            name="Ventas"
                        />
                        <Area
                            type="monotone"
                            dataKey="produccion"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#colorProduccion)"
                            name="Producción"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
