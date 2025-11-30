import api from './api';

export interface Venta {
    id: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    precioTotal: number;
    fecha: string;
    createdAt: string;
    producto?: {
        nombre: string;
    };
}

export interface CreateVentaData {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}

export interface VentaTendencia {
    fecha: string;
    total: number;
    cantidad: number;
}

class VentasService {
    async getAll(): Promise<Venta[]> {
        const response = await api.get<Venta[]>('/api/ventas');
        return response.data;
    }

    async getById(id: number): Promise<Venta> {
        const response = await api.get<Venta>(`/api/ventas/${id}`);
        return response.data;
    }

    async create(data: CreateVentaData): Promise<Venta> {
        const response = await api.post<Venta>('/api/ventas', data);
        return response.data;
    }

    async getByProducto(productoId: number): Promise<Venta[]> {
        const response = await api.get<Venta[]>(`/api/ventas/producto/${productoId}`);
        return response.data;
    }

    async getTendencia(): Promise<VentaTendencia[]> {
        const response = await api.get<VentaTendencia[]>('/api/ventas/tendencia');
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/api/ventas/${id}`);
    }
}

export default new VentasService();
