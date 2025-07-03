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

  // Si estamos en CI-CD, usar mock (detectado por variable CI o ausencia de DB_PASSWORD en test)
  if (process.env.CI || (process.env.NODE_ENV === 'test' && !process.env.DB_PASSWORD)) {
    console.log('🔧 Using mock database for CI-CD environment');
    return require('./db.test.js');
  }

  // Verificación preventiva
  if (!process.env.DB_PASSWORD || typeof process.env.DB_PASSWORD !== 'string') {
    // En lugar de salir, usar mock en CI-CD
    if (process.env.NODE_ENV === 'test') {
      console.log('🔧 DB_PASSWORD not found, using mock database for testing');
      return require('./db.test.js');
    }
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