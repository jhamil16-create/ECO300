import api from './api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    usuario: {
        id: number;
        username: string;
    };
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/api/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.usuario));
        }
        return response.data;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/api/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.usuario));
        }
        return response.data;
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUser(): any {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export default new AuthService();
