// src/services/auth.js
import axios from 'axios';

export function isAuthenticated() {
    const token = getAuthToken();
    console.log('Vérification de l\'authentification, token:', token);
    return !!token; // Vérifiez si un token d'authentification est présent
}

export function login(token) {
    console.log('Connexion, token:', token);
    // Le token est maintenant géré par les cookies, donc pas besoin de le stocker dans le localStorage
}

export function logout() {
    console.log('Déconnexion');
    // Supprimez le cookie authToken
    document.cookie = 'authToken=; Max-Age=0; path=/';
}

export function getAuthToken() {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('authToken='));
    if (tokenCookie) {
        const token = tokenCookie.split('=')[1]?.trim();
        if (token) {
            console.log('Token trouvé:', token);
            return token;
        }
    }
    console.log('Aucun token trouvé');
    return null;
}
