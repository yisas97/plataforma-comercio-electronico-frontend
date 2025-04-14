import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { register, setSession } from '@/services/auth.service';

export const registerUser = defineAction({
    accept: 'form',
    input: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
    }),
    handler: async ({ name, email, password }) => {
        try {
            const response = await register({ name, email, password });

            return {
                ok: true,
                data: response
            };
        } catch (error) {
            return {
                ok: false,
                error: {
                    message: error.message || 'Error al registrar usuario'
                }
            };
        }
    },
});