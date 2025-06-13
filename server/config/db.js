const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');

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
  connectionString: process.env.DATABASE_URL,
  database: process.env.DB_NAME
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL desde config/db.js'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;
