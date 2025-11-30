import { PredictionChart } from '../components/predictions/PredictionChart';
import { ExternalFactors } from '../components/predictions/ExternalFactors';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { salesPredictions, externalFactors } from '../data/mockData';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

export function PredictionsPage() {
  return (
    <div className="space-y-6">
      {/* Banner informativo */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-2">
                Sistema de Predicción Inteligente
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Nuestro modelo de inteligencia artificial analiza patrones históricos, tendencias del mercado, 
                factores externos y comportamiento estacional para predecir ventas futuras con alta precisión.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Precisión promedio: 92.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Actualizado diariamente</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de predicción */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Predicción Próximo Mes</p>
              <p className="text-3xl text-gray-900 mb-2">$68,500</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+2.2% vs mes actual</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Confianza del Modelo</p>
              <p className="text-3xl text-gray-900 mb-2">88%</p>
              <p className="text-sm text-gray-600">Alto nivel de certeza</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Tendencia Detectada</p>
              <p className="text-3xl text-gray-900 mb-2">Crecimiento</p>
              <p className="text-sm text-green-600">Moderado y sostenible</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de predicción */}
      <PredictionChart data={salesPredictions} />

      {/* Factores externos */}
      <ExternalFactors factors={externalFactors} />

      {/* Recomendaciones basadas en predicciones */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Basadas en Predicciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm text-green-900 mb-2">✓ Mantener Niveles de Producción</h4>
              <p className="text-sm text-gray-700">
                La predicción muestra un crecimiento estable. Mantenga los niveles actuales de producción 
                y ajuste gradualmente según la demanda real.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm text-blue-900 mb-2">ℹ Prepararse para Estacionalidad</h4>
              <p className="text-sm text-gray-700">
                Se anticipa un aumento del 12.5% por factores estacionales. Asegure suficiente inventario 
                y capacidad de producción para los próximos 2 meses.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-sm text-orange-900 mb-2">⚠ Monitorear Competencia</h4>
              <p className="text-sm text-gray-700">
                Nuevos competidores pueden impactar negativamente en un 5.3%. Considere estrategias 
                de diferenciación o ajustes de precio selectivos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
