// para cambiar la urls en base en que enviroment
const configs = {
  development: 'http://localhost:5000',
  production: 'http://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com'
};


// Asegúrate de que NODE_ENV esté correctamente establecido durante el build
console.log('NODE_ENV:', process.env.NODE_ENV);

export const API_BASE_URL = process.env.NODE_ENV === 'production' //cambiar si es local
  ? configs.production 
  : configs.development;

// Log para depuración  
console.log('API_BASE_URL configurada como:', API_BASE_URL);