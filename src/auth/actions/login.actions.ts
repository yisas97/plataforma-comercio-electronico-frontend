import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { login, setSession } from '@/services/auth.service';

export const loginUser = defineAction({
    accept: 'form',
    input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    }),
    handler: async ({ email, password }) => {
        try {
            const response = await login({ email, password });

            // Solo devolvemos ok: true para que el cliente maneje la redirección
            // La sesión se gestionará con localStorage en el cliente
            console.log(response);
            return {
                ok: true,
                data: response
            };
        } catch (error) {
            return {
                ok: false,
                error: {
                    message: error.message || 'Credenciales incorrectas'
                }
            };
        }
    },
});