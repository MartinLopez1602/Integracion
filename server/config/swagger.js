const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Integración',
      version: '1.0.0',
      description: 'API para gestionar productos, categorías, sucursales, pedidos y contacto',
    },
    servers: [
      {
        url: 'http://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com/',
        description: 'Servidor de producción en AWS'
      },
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo local'
      },
    ],
  },
  apis: ['routes/*.js'],
};

module.exports = swaggerOptions;