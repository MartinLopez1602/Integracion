require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();

// Configuración Swagger
console.log('Cargando configuraciones de Swagger...');
const swaggerOptions = require('./config/swagger');
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log('Configuraciones de Swagger cargadas correctamente.');

// Agregar ANTES del middleware app.use((req, res) => {...}) que maneja las rutas no encontradas
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date(),
    version: require('./package.json').version,
    env: process.env.NODE_ENV
  });
});


// Middlewares
console.log('Configurando middlewares...');
app.use(cors({
  origin: [
    'http://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com',
    'https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com',
    'https://ferremas-app-env.eba-cmwanbjq.us-east-1.elasticbeanstalk.com', 
    'https://prod.d27clnoc1pnl0o.amplifyapp.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
console.log('Middlewares configurados.');

//imagenes
app.use('/images', express.static(path.join(__dirname, 'images')));

// Documentación Swagger
console.log('Configurando documentación Swagger...');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log('Documentación Swagger disponible en /api-docs');

// Rutas
console.log('Cargando rutas...');

const webpayRoutes = require('./routes/webpay');
console.log('Ruta /api/webpay cargada.');

const productoRoutes = require('./routes/producto');
console.log('Ruta /api/producto cargada.');

const tipoProductoRoutes = require('./routes/tipo_producto');
console.log('Ruta /api/tipo-producto cargada.');

const sucursalRoutes = require('./routes/sucursal');
console.log('Ruta /api/sucursal cargada.');

const pedidosRoutes = require('./routes/pedidos');
console.log('Ruta /api/pedido cargada.');

const contactoRoutes = require('./routes/contacto');
console.log('Ruta /api/contacto cargada.');

const monedaRoutes = require('./routes/moneda');
console.log('Ruta /api/moneda cargada.');

const testRoutes = require('./routes/test');
console.log('Ruta /api/test cargada.');

// Registro de rutas
app.use('/api/producto', productoRoutes);  
app.use('/api/productos', productoRoutes);
app.use('/api/tipo-producto', tipoProductoRoutes);
app.use('/api/sucursal', sucursalRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/moneda', monedaRoutes);
app.use('/api/test', testRoutes);
app.use('/api/webpay', webpayRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


// NO TOCAR, YA LO ARREGLE DEJENLO TAL CUAL NO HAGAN NADA O ME SUICIDO
app.use((req, res) => {
  console.log(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

process.on('uncaughtException', (error) => {
  console.error('ERROR NO CAPTURADO! 💥', error.message);
  console.error(error.stack);
  // No cerrar el servidor, solo registrar el error
});

process.on('unhandledRejection', (error) => {
  console.error('PROMESA RECHAZADA NO MANEJADA! 💥', error.message);
  console.error(error.stack);
  // No cerrar el servidor, solo registrar el error
});

// Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor backend en http://localhost:${PORT}`));
