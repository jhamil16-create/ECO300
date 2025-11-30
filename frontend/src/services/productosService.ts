import api from './api';

export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precioVenta: number;
    costoProduccion: number;
    unidadMedida: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductoData {
    nombre: string;
    descripcion?: string;
    precioVenta: number;
    costoProduccion: number;
    unidadMedida?: string;
}

class ProductosService {
    async getAll(): Promise<Producto[]> {
        const response = await api.get<Producto[]>('/api/productos');
        return response.data;
    }

    async getById(id: number): Promise<Producto> {
        const response = await api.get<Producto>(`/api/productos/${id}`);
        return response.data;
    }

    async create(data: CreateProductoData): Promise<Producto> {
        const response = await api.post<Producto>('/api/productos', data);
        return response.data;
    }

    async update(id: number, data: Partial<CreateProductoData>): Promise<Producto> {
        const response = await api.put<Producto>(`/api/productos/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/api/productos/${id}`);
    }
}

export default new ProductosService();
