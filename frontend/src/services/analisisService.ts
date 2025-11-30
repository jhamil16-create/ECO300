import api from './api';

export interface DashboardData {
    metricas: {
        ventasMes: number;
        produccionActual: number;
        costoPromedio: number;
        eficiencia: number;
    };
    ventasPorMes: Array<{
        mes: string;
        ventas: number;
        produccion: number;
    }>;
    inventarioEstado: Array<{
        producto: string;
        stockActual: number;
        stockOptimo: number;
    }>;
}

export interface PuntoEquilibrio {
    productoId: number;
    nombreProducto: string;
    costoFijo: number;
    costoVariable: number;
    precioVenta: number;
    unidadesEquilibrio: number;
    ventasEquilibrio: number;
    margenContribucion: number;
}

export interface Margen {
    productoId: number;
    nombreProducto: string;
    precioVenta: number;
    costoProduccion: number;
    margenBruto: number;
    margenPorcentaje: number;
}

export interface Prediccion {
    id: number;
    productoId: number;
    demandaPredicha: number;
    periodo: string;
    fechaPrediccion: string;
    confianza: number;
    metodo: string;
    producto?: {
        nombre: string;
    };
}

class AnalisisService {
    async getDashboard(): Promise<DashboardData> {
        const response = await api.get<DashboardData>('/api/analisis/dashboard');
        return response.data;
    }

    async getPuntoEquilibrio(productoId?: number): Promise<PuntoEquilibrio | PuntoEquilibrio[]> {
        const url = productoId
            ? `/api/analisis/punto-equilibrio/${productoId}`
            : '/api/analisis/punto-equilibrio';
        const response = await api.get(url);
        return response.data;
    }

    async getMargenes(): Promise<Margen[]> {
        const response = await api.get<Margen[]>('/api/analisis/margenes');
        return response.data;
    }

    async getPredicciones(productoId?: number): Promise<Prediccion[]> {
        const url = productoId
            ? `/api/analisis/predicciones?productoId=${productoId}`
            : '/api/analisis/predicciones';
        const response = await api.get<Prediccion[]>(url);
        return response.data;
    }

    async calcularElasticidad(productoId: number): Promise<any> {
        const response = await api.get(`/api/analisis/elasticidad/${productoId}`);
        return response.data;
    }
}

export default new AnalisisService();
