require('dotenv').config({ path: '../.env' });
const pool = require('../db');

async function migrateProductos() {
  try {
    console.log('Iniciando migración de tabla productos...');

    // Crear la tabla productos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id_prod SERIAL PRIMARY KEY,
        nombre_prod VARCHAR(255) NOT NULL,
        precio_prod DECIMAL(10, 2) NOT NULL,
        stock_prod INT
      );
    `);

    // Insertar datos de ejemplo si la tabla está vacía
    const checkData = await pool.query('SELECT COUNT(*) FROM productos');
    if (parseInt(checkData.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO productos (nombre_prod, precio_prod) 
        VALUES 
          ('Producto 1', 19.99),
          ('Producto 2', 29.99),
          ('Producto 3', 39.99);
      `);
      console.log('✅ Datos de ejemplo insertados');
    }

    console.log('✅ Migración completada con éxito');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

migrateProductos();