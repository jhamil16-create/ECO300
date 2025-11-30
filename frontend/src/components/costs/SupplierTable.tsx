import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Supplier } from '../../types';
import { Star } from 'lucide-react';

interface SupplierTableProps {
  suppliers: Supplier[];
}

export function SupplierTable({ suppliers }: SupplierTableProps) {
  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 90) return 'bg-green-100 text-green-800';
    if (reliability >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proveedores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Confiabilidad</TableHead>
              <TableHead>Tiempo Entrega</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{supplier.contact}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {supplier.products.map((product, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getReliabilityColor(supplier.reliability)}>
                    <Star className="w-3 h-3 mr-1" />
                    {supplier.reliability}%
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{supplier.avgDeliveryTime} días</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
