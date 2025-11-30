import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { InventoryData } from '../../types';

interface InventoryChartProps {
    data: InventoryData[];
}

export function InventoryChart({ data }: InventoryChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="product" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="stockActual" fill="#3b82f6" name="Stock Actual" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="stockOptimo" fill="#10b981" name="Stock Óptimo" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
