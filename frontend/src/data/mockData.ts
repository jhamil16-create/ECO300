// Datos de ejemplo para el sistema

import { SalesData, InventoryData, ProductSalesData, ProductionData, Metric, Alert, InventoryItem, CostData, Supplier, PredictionData, ExternalFactor } from '../types';

export const dashboardMetrics: Metric[] = [
  {
    label: 'Ventas del Mes',
    value: '$67,000',
    change: '+12.5%',
    isPositive: true,
    icon: 'trending-up',
    iconColor: 'bg-green-100 text-green-600'
  },
  {
    label: 'Producción Actual',
    value: '65,000 unid.',
    change: '-2.3%',
    isPositive: false,
    icon: 'package',
    iconColor: 'bg-blue-100 text-blue-600'
  },
  {
    label: 'Costo Promedio',
    value: '$12.50/unid',
    change: '+3.1%',
    isPositive: true,
    icon: 'dollar-sign',
    iconColor: 'bg-orange-100 text-orange-600'
  },
  {
    label: 'Eficiencia',
    value: '94.2%',
    change: '+2.1%',
    isPositive: true,
    icon: 'check-circle',
    iconColor: 'bg-green-100 text-green-600'
  }
];

export const salesVsProduction: SalesData[] = [
  { month: 'Ene', ventas: 45000, produccion: 48000 },
  { month: 'Feb', ventas: 52000, produccion: 50000 },
  { month: 'Mar', ventas: 58000, produccion: 55000 },
  { month: 'Abr', ventas: 62000, produccion: 60000 },
  { month: 'May', ventas: 65000, produccion: 63000 },
  { month: 'Jun', ventas: 67000, produccion: 65000 }
];

export const inventoryData: InventoryData[] = [
  { product: 'Producto A', stockActual: 1200, stockOptimo: 950 },
  { product: 'Producto B', stockActual: 780, stockOptimo: 1180 },
  { product: 'Producto C', stockActual: 1520, stockOptimo: 1020 },
  { product: 'Producto D', stockActual: 620, stockOptimo: 880 }
];

export const salesMetrics: Metric[] = [
  {
    label: 'Ventas Totales',
    value: '$23,700',
    change: '+8.2% vs período anterior',
    isPositive: true,
    icon: 'dollar-sign',
    iconColor: 'bg-blue-100 text-blue-600'
  },
  {
    label: 'Ticket Promedio',
    value: '$3950.00',
    change: 'Por transacción',
    isPositive: true,
    icon: 'trending-up',
    iconColor: 'bg-green-100 text-green-600'
  },
  {
    label: 'Transacciones',
    value: '6',
    change: 'Últimos 7 días',
    isPositive: true,
    icon: 'shopping-cart',
    iconColor: 'bg-purple-100 text-purple-600'
  }
];

export const productSalesTrend: ProductSalesData[] = [
  { week: 'Sem 1', productoA: 2400, productoB: 3200, productoC: 2800, productoD: 1900 },
  { week: 'Sem 2', productoA: 2200, productoB: 2900, productoC: 3000, productoD: 2100 },
  { week: 'Sem 3', productoA: 3000, productoB: 3100, productoC: 2900, productoD: 2250 },
  { week: 'Sem 4', productoA: 3200, productoB: 3150, productoC: 3100, productoD: 2400 }
];

export const productionMetrics: Metric[] = [
  {
    label: 'Producción Total',
    value: '920 unidades',
    change: '+5.3% vs período anterior',
    isPositive: true,
    icon: 'box',
    iconColor: 'bg-purple-100 text-purple-600'
  },
  {
    label: 'Eficiencia Promedio',
    value: '92.4%',
    change: 'Sobre capacidad planificada',
    isPositive: true,
    icon: 'trending-up',
    iconColor: 'bg-blue-100 text-blue-600'
  },
  {
    label: 'Ciclos de Producción',
    value: '5',
    change: 'Últimos 7 días',
    isPositive: true,
    icon: 'repeat',
    iconColor: 'bg-orange-100 text-orange-600'
  }
];

export const productionComparison: ProductionData[] = [
  { week: 'Sem 1', planificada: 2800, real: 2650 },
  { week: 'Sem 2', planificada: 3200, real: 3100 },
  { week: 'Sem 3', planificada: 2900, real: 2750 },
  { week: 'Sem 4', planificada: 3400, real: 3250 }
];

// Usuario mock para login
export const mockUser = {
  email: 'admin@empresa.com',
  password: 'admin123',
  name: 'Administrador',
  company: 'Empresa Demo S.A.'
};

// Alertas del sistema
export const systemAlerts: Alert[] = [
  {
    id: '1',
    type: 'danger',
    title: 'Exceso de Producción Detectado',
    message: 'Producto A: Producción 15% superior a ventas. Riesgo de inventario sin salida.',
    date: '2024-11-20',
    isRead: false,
    priority: 'high',
    category: 'produccion'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Stock Bajo - Producto B',
    message: 'El stock actual está por debajo del nivel mínimo. Considere realizar un pedido.',
    date: '2024-11-21',
    isRead: false,
    priority: 'high',
    category: 'inventario'
  },
  {
    id: '3',
    type: 'info',
    title: 'Tendencia Positiva en Ventas',
    message: 'Las ventas del Producto C han aumentado 18% en las últimas 2 semanas.',
    date: '2024-11-22',
    isRead: false,
    priority: 'medium',
    category: 'ventas'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Aumento en Costos de Materia Prima',
    message: 'Se detectó un incremento del 8% en costos de proveedores. Considere ajustar precios.',
    date: '2024-11-22',
    isRead: true,
    priority: 'medium',
    category: 'costos'
  },
  {
    id: '5',
    type: 'success',
    title: 'Balance Óptimo Alcanzado',
    message: 'La relación producción-ventas está en equilibrio perfecto este mes.',
    date: '2024-11-23',
    isRead: false,
    priority: 'low',
    category: 'prediccion'
  },
  {
    id: '6',
    type: 'danger',
    title: 'Predicción: Caída en Demanda',
    message: 'El modelo predice una reducción del 12% en ventas para el próximo mes. Ajuste la producción.',
    date: '2024-11-23',
    isRead: false,
    priority: 'high',
    category: 'prediccion'
  }
];

// Inventario detallado
export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    product: 'Producto A',
    stockActual: 1200,
    stockMinimo: 800,
    stockOptimo: 1000,
    stockMaximo: 1500,
    costo: 8.50,
    precio: 15.00,
    proveedor: 'Proveedor ABC',
    ultimaActualizacion: '2024-11-23',
    estado: 'exceso'
  },
  {
    id: '2',
    product: 'Producto B',
    stockActual: 650,
    stockMinimo: 900,
    stockOptimo: 1200,
    stockMaximo: 1800,
    costo: 12.00,
    precio: 22.00,
    proveedor: 'Proveedor XYZ',
    ultimaActualizacion: '2024-11-23',
    estado: 'critico'
  },
  {
    id: '3',
    product: 'Producto C',
    stockActual: 1520,
    stockMinimo: 700,
    stockOptimo: 1000,
    stockMaximo: 1400,
    costo: 6.75,
    precio: 12.50,
    proveedor: 'Proveedor ABC',
    ultimaActualizacion: '2024-11-23',
    estado: 'exceso'
  },
  {
    id: '4',
    product: 'Producto D',
    stockActual: 880,
    stockMinimo: 600,
    stockOptimo: 900,
    stockMaximo: 1200,
    costo: 10.25,
    precio: 18.00,
    proveedor: 'Proveedor DEF',
    ultimaActualizacion: '2024-11-23',
    estado: 'optimo'
  }
];

// Datos de costos
export const costBreakdown: CostData[] = [
  { category: 'Materia Prima', value: 42500, percentage: 42 },
  { category: 'Mano de Obra', value: 28000, percentage: 28 },
  { category: 'Operación y Mantenimiento', value: 15000, percentage: 15 },
  { category: 'Transporte y Logística', value: 8500, percentage: 8.5 },
  { category: 'Otros Gastos', value: 6000, percentage: 6.5 }
];

// Proveedores
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Proveedor ABC',
    contact: 'contacto@abc.com',
    products: ['Producto A', 'Producto C'],
    reliability: 95,
    avgDeliveryTime: 3
  },
  {
    id: '2',
    name: 'Proveedor XYZ',
    contact: 'ventas@xyz.com',
    products: ['Producto B'],
    reliability: 88,
    avgDeliveryTime: 5
  },
  {
    id: '3',
    name: 'Proveedor DEF',
    contact: 'info@def.com',
    products: ['Producto D'],
    reliability: 92,
    avgDeliveryTime: 4
  }
];

// Predicciones de ventas
export const salesPredictions: PredictionData[] = [
  { month: 'Ene', ventasReal: 45000, ventasPredicha: 46000, confianza: 95 },
  { month: 'Feb', ventasReal: 52000, ventasPredicha: 51500, confianza: 94 },
  { month: 'Mar', ventasReal: 58000, ventasPredicha: 57800, confianza: 93 },
  { month: 'Abr', ventasReal: 62000, ventasPredicha: 62500, confianza: 92 },
  { month: 'May', ventasReal: 65000, ventasPredicha: 64800, confianza: 91 },
  { month: 'Jun', ventasReal: 67000, ventasPredicha: 67200, confianza: 90 },
  { month: 'Jul', ventasPredicha: 68500, confianza: 88 },
  { month: 'Ago', ventasPredicha: 70000, confianza: 85 },
  { month: 'Sep', ventasPredicha: 71200, confianza: 82 }
];

// Factores externos
export const externalFactors: ExternalFactor[] = [
  { factor: 'Inflación', impacto: 8.2, descripcion: 'Incremento en costos de materia prima' },
  { factor: 'Estacionalidad', impacto: 12.5, descripcion: 'Aumento de demanda en temporada alta' },
  { factor: 'Competencia', impacto: -5.3, descripcion: 'Nuevos competidores en el mercado' },
  { factor: 'Clima', impacto: -3.1, descripcion: 'Condiciones climáticas adversas' },
  { factor: 'Poder Adquisitivo', impacto: 6.8, descripcion: 'Mejora en economía local' }
];

// Registros de ventas
export interface SaleRecord {
  id: string;
  fecha: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export const salesRecords: SaleRecord[] = [
  { id: '1', fecha: '2024-06-20', producto: 'Producto A', cantidad: 150, precioUnitario: 25, total: 3750 },
  { id: '2', fecha: '2024-06-19', producto: 'Producto B', cantidad: 200, precioUnitario: 18, total: 3600 },
  { id: '3', fecha: '2024-06-18', producto: 'Producto C', cantidad: 120, precioUnitario: 32, total: 3840 },
  { id: '4', fecha: '2024-06-17', producto: 'Producto A', cantidad: 180, precioUnitario: 25, total: 4500 },
  { id: '5', fecha: '2024-06-16', producto: 'Producto D', cantidad: 90, precioUnitario: 45, total: 4050 },
  { id: '6', fecha: '2024-06-15', producto: 'Producto B', cantidad: 220, precioUnitario: 18, total: 3960 }
];

// Registros de producción
export interface ProductionRecord {
  id: string;
  fecha: string;
  producto: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  eficiencia: number;
}

export const productionRecords: ProductionRecord[] = [
  { id: '1', fecha: '2024-06-20', producto: 'Producto A', cantidad: 200, costoUnitario: 10, costoTotal: 2000, eficiencia: 95 },
  { id: '2', fecha: '2024-06-19', producto: 'Producto B', cantidad: 250, costoUnitario: 8, costoTotal: 2000, eficiencia: 92 },
  { id: '3', fecha: '2024-06-18', producto: 'Producto C', cantidad: 150, costoUnitario: 15, costoTotal: 2250, eficiencia: 88 },
  { id: '4', fecha: '2024-06-17', producto: 'Producto A', cantidad: 220, costoUnitario: 10, costoTotal: 2200, eficiencia: 97 },
  { id: '5', fecha: '2024-06-16', producto: 'Producto D', cantidad: 100, costoUnitario: 22, costoTotal: 2200, eficiencia: 90 }
];

export const productOptions = ['Producto A', 'Producto B', 'Producto C', 'Producto D'];