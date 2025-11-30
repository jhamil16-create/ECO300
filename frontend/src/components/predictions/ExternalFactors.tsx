import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ExternalFactor } from '../../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ExternalFactorsProps {
  factors: ExternalFactor[];
}

export function ExternalFactors({ factors }: ExternalFactorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Factores Externos que Afectan el Negocio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {factors.map((factor, index) => {
            const isPositive = factor.impacto > 0;
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm text-gray-900">{factor.factor}</h4>
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {isPositive ? '+' : ''}{factor.impacto}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{factor.descripcion}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-900">
            <strong>Recomendación:</strong> El análisis muestra un impacto positivo neto. 
            Considere capitalizar la estacionalidad y ajustar precios considerando la inflación.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
