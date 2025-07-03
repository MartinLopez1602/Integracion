// Configuración de URLs por entorno
const configs = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
    FRONTEND_URL: 'http://localhost:3000'
  },
  production: {
    API_BASE_URL: 'https://integracion-integracion.up.railway.app', // BACKEND
    FRONTEND_URL: 'https://integracion-five.vercel.app'             // FRONTEND
  }
};

// Detectar entorno
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// Exportar URLs según entorno
export const API_BASE_URL = configs[ENV].API_BASE_URL;
export const FRONTEND_URL = configs[ENV].FRONTEND_URL;

// Logs de depuración
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API_BASE_URL configurada como:', API_BASE_URL);
console.log('FRONTEND_URL configurada como:', FRONTEND_URL);

// Función para construir URLs de API
export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Función para construir URLs de imágenes desde el servidor
export const buildImageUrl = (imagePath) => `${API_BASE_URL}/images/${imagePath}`;

// Función para construir URLs del frontend (usado en returnUrl)
export const buildFrontendUrl = (path) => `${FRONTEND_URL}${path}`;
