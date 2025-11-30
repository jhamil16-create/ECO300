import api from './api';

export interface Inventario {
    id: number;
    productoId: number;
    cantidadActual: number;
    cantidadMinima: number;
    cantidadMaxima: number;
    ubicacion?: string;
    createdAt: string;
    updatedAt: string;
    producto?: {
        nombre: string;
        precioVenta: number;
        costoProduccion: number;
    };
}

export interface MovimientoInventario {
    id: number;
    inventarioId: number;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    motivo?: string;
    fecha: string;
}

export interface UpdateStockData {
    cantidad: number;
    tipo: 'ENTRADA' | 'SALIDA';
    motivo?: string;
}

class InventarioService {
    async getAll(): Promise<Inventario[]> {
        const response = await api.get<Inventario[]>('/api/inventario');
        return response.data;
    }

    async getById(id: number): Promise<Inventario> {
        const response = await api.get<Inventario>(`/api/inventario/${id}`);
        return response.data;
    }

    async getByProducto(productoId: number): Promise<Inventario> {
        const response = await api.get<Inventario>(`/api/inventario/producto/${productoId}`);
        return response.data;
    }

    async updateStock(id: number, data: UpdateStockData): Promise<Inventario> {
        const response = await api.put<Inventario>(`/api/inventario/${id}/movimiento`, data);
        return response.data;
    }

    async getMovimientos(inventarioId: number): Promise<MovimientoInventario[]> {
        const response = await api.get<MovimientoInventario[]>(`/api/inventario/${inventarioId}/movimientos`);
        return response.data;
    }
}

export default new InventarioService();
