require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Configuraciones
const swaggerOptions = require('./config/swagger');
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
const productsRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const sucursalesRoutes = require('./routes/sucursales');
const pedidosRoutes = require('./routes/pedidos');
const contactoRoutes = require('./routes/contacto');
const monedaRoutes = require('./routes/moneda');

app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

app.use('/api/productos', productsRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/moneda', monedaRoutes);

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor backend en http://localhost:${PORT}`));
