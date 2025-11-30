import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';
import { ProductionRecord, productOptions } from '../../data/mockData';

interface ProductionRegistryProps {
  records: ProductionRecord[];
}

export function ProductionRegistry({ records: initialRecords }: ProductionRegistryProps) {
  const [records, setRecords] = useState<ProductionRecord[]>(initialRecords);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha: '',
    producto: '',
    cantidad: '',
    costoUnitario: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cantidad = parseFloat(formData.cantidad);
    const costoUnitario = parseFloat(formData.costoUnitario);
    const costoTotal = cantidad * costoUnitario;
    const eficiencia = Math.floor(Math.random() * 15) + 85; // Simulación: 85-100%

    const newRecord: ProductionRecord = {
      id: Date.now().toString(),
      fecha: formData.fecha,
      producto: formData.producto,
      cantidad,
      costoUnitario,
      costoTotal,
      eficiencia
    };

    setRecords([newRecord, ...records]);
    setFormData({ fecha: '', producto: '', cantidad: '', costoUnitario: '' });
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData({ fecha: '', producto: '', cantidad: '', costoUnitario: '' });
    setShowForm(false);
  };

  const getEfficiencyBadge = (eficiencia: number) => {
    if (eficiencia >= 95) {
      return <Badge className="bg-green-100 text-green-800">{eficiencia}%</Badge>;
    } else if (eficiencia >= 90) {
      return <Badge className="bg-yellow-100 text-yellow-800">{eficiencia}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">{eficiencia}%</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registro de Producción</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4" />
            Nueva Producción
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="fecha-prod">Fecha</Label>
                <Input
                  id="fecha-prod"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producto-prod">Producto</Label>
                <Select
                  value={formData.producto}
                  onValueChange={(value) => setFormData({ ...formData, producto: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad-prod">Cantidad</Label>
                <Input
                  id="cantidad-prod"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costoUnitario">Costo Unitario</Label>
                <Input
                  id="costoUnitario"
                  type="number"
                  step="0.01"
                  value={formData.costoUnitario}
                  onChange={(e) => setFormData({ ...formData, costoUnitario: e.target.value })}
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo Unit.</TableHead>
                <TableHead>Costo Total</TableHead>
                <TableHead>Eficiencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.fecha}</TableCell>
                  <TableCell>{record.producto}</TableCell>
                  <TableCell>{record.cantidad}</TableCell>
                  <TableCell>${record.costoUnitario}</TableCell>
                  <TableCell>${record.costoTotal.toLocaleString()}</TableCell>
                  <TableCell>{getEfficiencyBadge(record.eficiencia)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
