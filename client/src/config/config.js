// Configuración de backends
const configs = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
    FRONTEND_URL: 'http://localhost:3000'
  },
  production: {
    API_BASE_URL: 'https://integracion-integracion.up.railway.app',
    FRONTEND_URL: 'https://integracion-five.vercel.app'
  }
};

// Detección automática de entorno
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const API_BASE_URL = configs[ENV].API_BASE_URL;
export const FRONTEND_URL = configs[ENV].FRONTEND_URL;

// Logs útiles para debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('FRONTEND_URL:', FRONTEND_URL);

// Construir URLs de API y frontend
export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
export const buildFrontendUrl = (path) => `${FRONTEND_URL}${path}`;
export const buildImageUrl = (imagePath) => `${API_BASE_URL}/images/${imagePath}`;
