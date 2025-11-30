import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus } from 'lucide-react';
import { SaleRecord, productOptions } from '../../data/mockData';

interface SalesRegistryProps {
  records: SaleRecord[];
}

export function SalesRegistry({ records: initialRecords }: SalesRegistryProps) {
  const [records, setRecords] = useState<SaleRecord[]>(initialRecords);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha: '',
    producto: '',
    cantidad: '',
    precioUnitario: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cantidad = parseFloat(formData.cantidad);
    const precioUnitario = parseFloat(formData.precioUnitario);
    const total = cantidad * precioUnitario;

    const newRecord: SaleRecord = {
      id: Date.now().toString(),
      fecha: formData.fecha,
      producto: formData.producto,
      cantidad,
      precioUnitario,
      total
    };

    setRecords([newRecord, ...records]);
    setFormData({ fecha: '', producto: '', cantidad: '', precioUnitario: '' });
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData({ fecha: '', producto: '', cantidad: '', precioUnitario: '' });
    setShowForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registro de Ventas</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Venta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producto">Producto</Label>
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
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precioUnitario">Precio Unitario</Label>
                <Input
                  id="precioUnitario"
                  type="number"
                  step="0.01"
                  value={formData.precioUnitario}
                  onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Guardar</Button>
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
                <TableHead>Precio Unit.</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.fecha}</TableCell>
                  <TableCell>{record.producto}</TableCell>
                  <TableCell>{record.cantidad}</TableCell>
                  <TableCell>${record.precioUnitario}</TableCell>
                  <TableCell>${record.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
