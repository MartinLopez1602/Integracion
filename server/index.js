require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Configuraciones
console.log('Cargando configuraciones de Swagger...');
const swaggerOptions = require('./config/swagger');
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log('Configuraciones de Swagger cargadas correctamente.');

// Middlewares
console.log('Configurando middlewares...');
app.use(cors({ origin: 'http://localhost:3000' }));
console.log('CORS configurado para http://localhost:3000');
app.use(express.json());
console.log('Middleware para JSON configurado.');

// Documentación Swagger
console.log('Configurando documentación Swagger...');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log('Documentación Swagger disponible en /api-docs');

// Rutas
console.log('Cargando rutas...');
const productsRoutes = require('./routes/productos');
console.log('Ruta /api/productos cargada.');
const categoriasRoutes = require('./routes/categorias');
console.log('Ruta /api/categorias cargada.');
const sucursalesRoutes = require('./routes/sucursales');
console.log('Ruta /api/sucursales cargada.');
const pedidosRoutes = require('./routes/pedidos');
console.log('Ruta /api/pedidos cargada.');
const contactoRoutes = require('./routes/contacto');
console.log('Ruta /api/contacto cargada.');
const monedaRoutes = require('./routes/moneda');
console.log('Ruta /api/moneda cargada.');
const testRoutes = require('./routes/test');
console.log('Ruta /api/test cargada.');

app.get('/api/test', (req, res) => {
  console.log('Solicitud recibida en /api/test');
  res.json({ message: 'API funcionando correctamente' });
});

console.log('→ Cargando ruta /api/productos');
app.use('/api/productos', productsRoutes);

console.log('→ Cargando ruta /api/categorias');
app.use('/api/categorias', categoriasRoutes);

console.log('→ Cargando ruta /api/sucursales');
app.use('/api/sucursales', sucursalesRoutes);

console.log('→ Cargando ruta /api/pedidos');
app.use('/api/pedidos', pedidosRoutes);

console.log('→ Cargando ruta /api/contacto');
app.use('/api/contacto', contactoRoutes);

console.log('→ Cargando ruta /api/moneda');
app.use('/api/moneda', monedaRoutes);

console.log('→ Cargando ruta /api/test');
app.use('/api/test', testRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor backend en http://localhost:${PORT}`));