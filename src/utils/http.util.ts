/**
 * Obtiene el token de autenticación del localStorage
 * @returns Token de autenticación o null si no existe
 */
export function getAuthToken(): string | null {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
}

/**
 * Crea los headers para las peticiones con autorización
 * @returns Objeto con los headers
 */
export function getAuthHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ''
    };
}

/**
 * Maneja la respuesta de una petición a la API
 * @param response Respuesta de la petición
 * @returns Datos de la respuesta o error
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Construye una URL con parámetros de consulta
 * @param baseUrl URL base
 * @param params Objeto con los parámetros
 * @returns URL con los parámetros de consulta
 */
export function buildUrlWithParams(baseUrl: string, params: Record<string, any>): string {
    const url = new URL(baseUrl);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(v => url.searchParams.append(key, v.toString()));
            } else {
                url.searchParams.append(key, value.toString());
            }
        }
    });

    return url.toString();
}