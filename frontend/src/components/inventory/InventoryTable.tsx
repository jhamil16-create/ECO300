import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { InventoryItem } from '../../types';
import { AlertTriangle, CheckCircle, TrendingUp, XCircle } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'critico':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Crítico
          </Badge>
        );
      case 'bajo':
        return (
          <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3" />
            Bajo
          </Badge>
        );
      case 'optimo':
        return (
          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Óptimo
          </Badge>
        );
      case 'exceso':
        return (
          <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-800">
            <TrendingUp className="w-3 h-3" />
            Exceso
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Inventario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Stock Óptimo</TableHead>
                <TableHead>Rango</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Precio Venta</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.stockActual} unid.</TableCell>
                  <TableCell>{item.stockOptimo} unid.</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {item.stockMinimo} - {item.stockMaximo}
                  </TableCell>
                  <TableCell>${item.costo.toFixed(2)}</TableCell>
                  <TableCell>${item.precio.toFixed(2)}</TableCell>
                  <TableCell className="text-sm">{item.proveedor}</TableCell>
                  <TableCell>{getStatusBadge(item.estado)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
