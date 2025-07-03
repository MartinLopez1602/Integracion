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

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const API_BASE_URL = configs[ENV].API_BASE_URL;
export const FRONTEND_URL = configs[ENV].FRONTEND_URL;

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API_BASE_URL configurada como:', API_BASE_URL);
console.log('FRONTEND_URL configurada como:', FRONTEND_URL);

export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export const buildImageUrl = (imagePath) => {
  const cleanPath = imagePath?.replace(/^\/?images\//, '');
  return `${API_BASE_URL}/images/${cleanPath || 'Alargador.png'}`;
};

export const buildFrontendUrl = (path) => {
  const cleanPath = path?.startsWith('/') ? path.slice(1) : path;
  return `${FRONTEND_URL}/${cleanPath}`;
};
