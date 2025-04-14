// src/services/auth.service.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// Interfaces
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    name: string;
    email: string;
    role: string;
    verified: boolean;
}

// Función para hacer llamadas a la API
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    console.log(response);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ocurrió un error');
    }

    return response.json();
}

// Funciones de autenticación
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiCall<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

export async function register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiCall<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

export function logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Funciones auxiliares
export function setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify({
        id: authResponse.userId,
        name: authResponse.name,
        email: authResponse.email,
        role: authResponse.role,
        verified: authResponse.verified,
    }));
}

export function getSession(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
}

export function isAdmin(): boolean {
    const user = getSession();
    return user?.role === 'ROLE_ADMIN';
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}