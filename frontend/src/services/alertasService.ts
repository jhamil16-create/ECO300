import api from './api';

export interface Alerta {
    id: number;
    tipo: string; // "SOBREPRODUCCION", "ESCASEZ", "BAJO_MARGEN", "ALTA_DEMANDA"
    severidad: string; // "BAJA", "MEDIA", "ALTA"
    titulo: string;
    mensaje: string;
    productoId?: number;
    leida: boolean;
    fecha: string;
}

class AlertasService {
    async getAll(): Promise<Alerta[]> {
        const response = await api.get<Alerta[]>('/api/analisis/alertas');
        return response.data;
    }

    async getNoLeidas(): Promise<Alerta[]> {
        const response = await api.get<Alerta[]>('/api/analisis/alertas?leida=false');
        return response.data;
    }

    async marcarLeida(id: number): Promise<Alerta> {
        const response = await api.put<Alerta>(`/api/analisis/alertas/${id}/leida`);
        return response.data;
    }

    async marcarTodasLeidas(): Promise<void> {
        await api.put('/api/analisis/alertas/marcar-todas-leidas');
    }
}

export default new AlertasService();
