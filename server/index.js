require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');

// Middleware
app.use(express.json());

// Configuración de CORS (si es necesario)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Rutas de ejemplo
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Define aquí tus rutas CRUD...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor backend en http://localhost:${PORT}`));