import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'auth_token';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur de requête pour ajouter le token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupérer le token depuis localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs d'authentification
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Si l'erreur est 401 (non autorisé), déconnecter l'utilisateur
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('auth_user');

        // Rediriger vers la page de connexion si on n'y est pas déjà
        if (!window.location.pathname.includes('/auth/')) {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
