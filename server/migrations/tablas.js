require('dotenv').config({ path: '../.env' });
const pool = require('../db');

async function migrateTablas() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando migración de tablas...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Categorías
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id_categoria SERIAL PRIMARY KEY,
        nombre_categoria VARCHAR(100) NOT NULL,
        descripcion TEXT
      );
    `);
    
    // Add category_id to productos if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'productos' AND column_name = 'categoria_id'
        ) THEN
          ALTER TABLE productos ADD COLUMN categoria_id INTEGER REFERENCES categorias(id_categoria);
        END IF;
      END $$;
    `);
    
    // Sucursales
    await client.query(`
      CREATE TABLE IF NOT EXISTS sucursales (
        id_sucursal SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        email VARCHAR(100)
      );
    `);
    
    // Stock
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock (
        id SERIAL PRIMARY KEY,
        sucursal_id INTEGER NOT NULL REFERENCES sucursales(id_sucursal),
        producto_id INTEGER NOT NULL REFERENCES productos(id_prod),
        cantidad INTEGER NOT NULL DEFAULT 0,
        UNIQUE(sucursal_id, producto_id)
      );
    `);
    
    // Pedidos
    await client.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id_pedido SERIAL PRIMARY KEY,
        sucursal_id INTEGER NOT NULL REFERENCES sucursales(id_sucursal),
        fecha_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(50) DEFAULT 'pendiente'
      );
    `);
    
    // Pedidos detalle
    await client.query(`
      CREATE TABLE IF NOT EXISTS pedidos_detalle (
        id SERIAL PRIMARY KEY,
        pedido_id INTEGER NOT NULL REFERENCES pedidos(id_pedido),
        producto_id INTEGER NOT NULL REFERENCES productos(id_prod),
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10, 2)
      );
    `);
    
    // Contacto
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacto (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        mensaje TEXT NOT NULL,
        fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        leido BOOLEAN DEFAULT FALSE
      );
    `);
    
    // Insert sample data
    const categoriasCount = await client.query('SELECT COUNT(*) FROM categorias');
    if (parseInt(categoriasCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
          ('Electrónica', 'Productos electrónicos y gadgets'),
          ('Hogar', 'Productos para el hogar'),
          ('Ropa', 'Vestimenta y accesorios');
      `);
    }
    
    const sucursalesCount = await client.query('SELECT COUNT(*) FROM sucursales');
    if (parseInt(sucursalesCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO sucursales (nombre, direccion, telefono, email) VALUES 
          ('Sucursal Centro', 'Av. Corrientes 1234, CABA', '11-1234-5678', 'centro@empresa.com'),
          ('Sucursal Norte', 'Av. Cabildo 2000, CABA', '11-2345-6789', 'norte@empresa.com');
      `);
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Migración completada con éxito');
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrateTablas();