const path = require('path');
const { Pool } = require('pg');

//para que no falle en producción si no se define el .env, claramente esto era lo que fallaba XD
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

// Verificación preventiva
if (!process.env.DB_PASSWORD || typeof process.env.DB_PASSWORD !== 'string') {
  console.error('❌ ERROR: DB_PASSWORD debe estar definido y ser un string válido.');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Solo conectar y mostrar logs si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(() => console.log('✅ Conectado a PostgreSQL desde config/db.js'))
    .catch(err => console.error('❌ Error de conexión:', err));
}

module.exports = pool;