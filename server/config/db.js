const path = require('path');
const { Pool } = require('pg');

// Función para crear la configuración de la base de datos
function createDbConnection() {
  //para que no falle en producción si no se define el .env, claramente esto era lo que fallaba XD
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  }

  // En modo test, también cargar el .env si las variables no están definidas
  if (process.env.NODE_ENV === 'test' && !process.env.DB_PASSWORD) {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  }

  // Solo usar mock en testing local, NO en producción
  if (process.env.NODE_ENV === 'test') {
    console.log('🔧 Using mock database for testing');
    return require('./db.test.js');
  }

  // En producción, usar las variables de Railway
  if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Using Railway production database');
    const pool = new Pool({
      host: process.env.POSTGRES_HOST || process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.POSTGRES_USER || process.env.DB_USER,
      password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.POSTGRES_DATABASE || process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });
    return pool;
  }

  // Verificación preventiva para desarrollo
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

  return pool;
}

module.exports = createDbConnection();