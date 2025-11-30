import { AlertsList } from '../components/alerts/AlertsList';
import { RecommendationCards } from '../components/alerts/RecommendationCards';
import { Card, CardContent } from '../components/ui/card';
import { systemAlerts } from '../data/mockData';
import { Bell, Shield, Zap } from 'lucide-react';

export function AlertsPage() {
  const unreadCount = systemAlerts.filter(a => !a.isRead).length;
  const criticalCount = systemAlerts.filter(a => a.priority === 'high' && !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Banner de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alertas Activas</p>
                <p className="text-2xl text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Prioridad Alta</p>
                <p className="text-2xl text-gray-900">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sistema Activo</p>
                <p className="text-2xl text-green-600">24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones estratégicas */}
      <RecommendationCards />

      {/* Lista de alertas */}
      <AlertsList alerts={systemAlerts} />

      {/* Información del sistema */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm text-gray-900 mb-3">Acerca del Sistema de Alertas</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Monitoreo continuo:</strong> El sistema analiza datos en tiempo real para detectar 
              desbalances entre producción y ventas.
            </p>
            <p>
              • <strong>Alertas inteligentes:</strong> Reciba notificaciones cuando se detecten situaciones 
              que requieran atención (exceso de inventario, producción insuficiente, etc.).
            </p>
            <p>
              • <strong>Recomendaciones accionables:</strong> Cada alerta viene acompañada de sugerencias 
              específicas para resolver el problema detectado.
            </p>
            <p>
              • <strong>Prevención de pérdidas:</strong> Evite productos sin salida ("clavos") y optimice 
              el uso de recursos mediante ajustes oportunos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
