import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingDown, Package, DollarSign, Lightbulb } from 'lucide-react';

export function RecommendationCards() {
  const recommendations = [
    {
      icon: TrendingDown,
      iconColor: 'bg-orange-100 text-orange-600',
      title: 'Reducir Producción del Producto A',
      description: 'La producción supera las ventas en un 15%. Recomendamos reducir 200 unidades en el próximo ciclo.',
      action: 'Ajustar Producción'
    },
    {
      icon: Package,
      iconColor: 'bg-red-100 text-red-600',
      title: 'Reponer Stock del Producto B',
      description: 'El inventario está en nivel crítico. Realizar pedido urgente de 550 unidades al proveedor.',
      action: 'Crear Pedido'
    },
    {
      icon: DollarSign,
      iconColor: 'bg-green-100 text-green-600',
      title: 'Ajuste de Precios Recomendado',
      description: 'Incremento del 8% en costos. Considere ajustar precios en un 5% para mantener márgenes.',
      action: 'Ver Análisis'
    },
    {
      icon: Lightbulb,
      iconColor: 'bg-blue-100 text-blue-600',
      title: 'Oportunidad: Producto C',
      description: 'Demanda en alza del 18%. Aumentar producción podría generar $12,000 adicionales este mes.',
      action: 'Ver Detalles'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg text-gray-900">Recomendaciones Estratégicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${rec.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-900 mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <Button size="sm" variant="outline">
                      {rec.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
