import { defineMiddleware } from 'astro:middleware';
import { getSession, isAuthenticated, isAdmin } from './services/auth.service';

export const onRequest = defineMiddleware(({ locals, request }, next) => {
    // Inicializar valores por defecto
    locals.isLoggedIn = false;
    locals.isAdmin = false;
    locals.user = null;

    // Verificar autenticación del lado del cliente
    if (typeof localStorage !== 'undefined') {
        const user = getSession();
        if (user) {
            locals.isLoggedIn = true;
            locals.isAdmin = user.role === 'ROLE_ADMIN';
            locals.user = {
                name: user.name,
                email: user.email
            };
        }
    }

    return next();
});