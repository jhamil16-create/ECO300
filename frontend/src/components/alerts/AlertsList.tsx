import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert } from '../../types';
import { AlertTriangle, Info, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface AlertsListProps {
  alerts: Alert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Media</Badge>;
      case 'low':
        return <Badge variant="secondary">Baja</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categories: { [key: string]: string } = {
      inventario: 'Inventario',
      produccion: 'Producción',
      ventas: 'Ventas',
      costos: 'Costos',
      prediccion: 'Predicción'
    };
    return <Badge variant="outline">{categories[category] || category}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Alertas del Sistema</CardTitle>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            {alerts.filter(a => !a.isRead).length} sin leer
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 border rounded-lg ${getAlertBg(alert.type)} ${alert.isRead ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm text-gray-900">{alert.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getPriorityBadge(alert.priority)}
                      {getCategoryBadge(alert.category)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(alert.date).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
