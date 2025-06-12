// para cambiar la urls en base en que enviroment
const configs = {
  development: 'http://localhost:5000',
  production: 'https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com'
};

export const API_BASE_URL = process.env.NODE_ENV === 'production' //cambiar si es local
  ? configs.production 
  : configs.development;