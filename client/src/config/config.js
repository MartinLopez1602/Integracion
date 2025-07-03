// para cambiar la urls en base en que enviroment
const configs = {
  development: 'http://localhost:5000',
  production: 'backend-production-51bf.up.railway.app'
};

// Asegúrate de que NODE_ENV esté correctamente establecido durante el build
console.log('NODE_ENV:', process.env.NODE_ENV);

export const API_BASE_URL = process.env.NODE_ENV === 'production' //cambiar si es local
  ? configs.production 
  : configs.development;

// Log para depuración  
console.log('API_BASE_URL configurada como:', API_BASE_URL);

// Función para construir URLs de API
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Función para construir URLs de imágenes desde el servidor
export const buildImageUrl = (imagePath) => {
  // Las imágenes están servidas desde el backend
  return `${API_BASE_URL}/images/${imagePath}`;
};