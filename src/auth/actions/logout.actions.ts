import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const logoutUser = defineAction({
    accept: 'json',
    handler: async () => {
        // La limpieza del token se hace en el cliente
        return { ok: true };
    },
});