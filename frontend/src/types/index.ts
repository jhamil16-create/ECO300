// Tipos para el sistema de análisis empresarial

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  iconColor: string;
}

export interface SalesData {
  month: string;
  ventas: number;
  produccion: number;
}

export interface InventoryData {
  product: string;
  stockActual: number;
  stockOptimo: number;
}

export interface ProductSalesData {
  week: string;
  productoA: number;
  productoB: number;
  productoC: number;
  productoD: number;
}

export interface ProductionData {
  week: string;
  planificada: number;
  real: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'inventario' | 'produccion' | 'ventas' | 'costos' | 'prediccion';
}

export interface InventoryItem {
  id: string;
  product: string;
  stockActual: number;
  stockMinimo: number;
  stockOptimo: number;
  stockMaximo: number;
  costo: number;
  precio: number;
  proveedor: string;
  ultimaActualizacion: string;
  estado: 'critico' | 'bajo' | 'optimo' | 'exceso';
}

export interface CostData {
  category: string;
  value: number;
  percentage: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  products: string[];
  reliability: number;
  avgDeliveryTime: number;
}

export interface PredictionData {
  month: string;
  ventasReal?: number;
  ventasPredicha: number;
  confianza: number;
}

export interface ExternalFactor {
  factor: string;
  impacto: number;
  descripcion: string;
}