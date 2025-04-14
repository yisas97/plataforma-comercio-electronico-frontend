export function getSession() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

export function isAdmin() {
    const user = getSession();
    return user?.role === 'ROLE_ADMIN';
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}