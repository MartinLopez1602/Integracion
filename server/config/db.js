const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,     // Endpoint de tu RDS, ej: integracion-db.abcdef.us-east-1.rds.amazonaws.com
  port: process.env.DB_PORT,     // Por defecto 5432 para PostgreSQL
  user: process.env.DB_USER,     // integracion
  password: process.env.DB_PASSWORD, // Tu contraseña segura
  database: 'postgres',  // integracion
  ssl: {
    rejectUnauthorized: false // Para desarrollo, en producción usa true con certificados válidos
  }
});


pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL RDS'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;