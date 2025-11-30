import { Card, CardContent } from '../ui/card';
import { TrendingUp, TrendingDown, Package, DollarSign, CheckCircle, Box, Repeat, ShoppingCart } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: string;
    iconColor: string;
}

const iconMap = {
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'package': Package,
    'dollar-sign': DollarSign,
    'check-circle': CheckCircle,
    'box': Box,
    'repeat': Repeat,
    'shopping-cart': ShoppingCart
};

export function MetricCard({ label, value, change, isPositive, icon, iconColor }: MetricCardProps) {
    const IconComponent = iconMap[icon as keyof typeof iconMap] || TrendingUp;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">{label}</p>
                        <p className="text-3xl text-gray-900 mb-2">{value}</p>
                        <div className="flex items-center gap-1">
                            {isPositive ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {change}
                            </span>
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor}`}>
                        <IconComponent className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
