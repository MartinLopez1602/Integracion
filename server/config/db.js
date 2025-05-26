require('dotenv').config();
const { Pool } = require('pg');

// Variables para debuggear configuración
console.log('=== CONFIGURACIÓN DB ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT || '5432');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME || 'postgres');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Crear pool con manejo de errores mejorado
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 15000,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Manejo global de errores del pool
pool.on('error', (err) => {
  console.error('⚠️ ERROR INESPERADO DEL POOL DB:', err.message);
  // No cerramos el pool para permitir nuevas conexiones
});

// Función para retornar una versión mock si la DB no está disponible
const getFallbackData = (type) => {
  const mockData = {
    productos: [
      {id_prod: 1, nombre_prod: 'Taladro', precio_prod: '49990.00', stock_prod: 10, imagen_url: '/images/Taladro.png', tipo_producto: 'Herramientas'},
      {id_prod: 2, nombre_prod: 'Destornillador eléctrico', precio_prod: '29990.00', stock_prod: 15, imagen_url: '/images/Destornillador_electronico.png', tipo_producto: 'Herramientas'}
    ],
    destacados: [
      {id_prod: 1, nombre_prod: 'Taladro', precio_prod: '49990.00', stock_prod: 10, imagen_url: '/images/Taladro.png'},
      {id_prod: 2, nombre_prod: 'Destornillador eléctrico', precio_prod: '29990.00', stock_prod: 15, imagen_url: '/images/Destornillador_electronico.png'}
    ]
  };
  return mockData[type] || [];
};

// Función para queries tolerante a fallos
const safeQuery = async (text, params, type = null) => {
  let client;
  try {
    console.log('🔄 Ejecutando query:', text.substring(0, 80) + (text.length > 80 ? '...' : ''));
    client = await pool.connect();
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.error('❌ ERROR EN QUERY:', err.message);
    
    // Si tenemos un tipo de datos de respaldo y estamos en producción
    if (type && process.env.NODE_ENV === 'production') {
      console.log('⚠️ Usando datos de respaldo para:', type);
      return { rows: getFallbackData(type) };
    }
    throw err;
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  query: safeQuery,
  pool,
  getFallbackData
};