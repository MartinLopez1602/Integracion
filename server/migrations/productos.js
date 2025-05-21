async function createTable() {
  try {
    console.log('🔧 Creando la tabla productos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre_prod VARCHAR(255) NOT NULL,
        precio_prod NUMERIC(10, 2) NOT NULL,
        stock_prod INT NOT NULL
      );
    `);
    console.log('✅ Tabla productos creada o ya existía.');
  } catch (error) {
    console.error('❌ Error al crear la tabla:', error.message);
    throw new Error(`Error al crear la tabla: ${error.message}`);
  }
}

async function insertSampleData() {
  try {
    console.log('🔍 Verificando si hay datos en la tabla productos...');
    const checkData = await pool.query('SELECT COUNT(*) FROM productos');
    console.log(`📊 Número de registros actuales: ${checkData.rows[0].count}`);
    if (parseInt(checkData.rows[0].count) === 0) {
      console.log('📥 Insertando datos de ejemplo en la tabla productos...');
      await pool.query(`
        INSERT INTO productos (nombre_prod, precio_prod, stock_prod) 
        VALUES 
          ('Producto 1', 19.99, 100),
          ('Producto 2', 29.99, 200),
          ('Producto 3', 39.99, 300);
      `);
      console.log('✅ Datos de ejemplo insertados correctamente.');
    } else {
      console.log('⚠️ La tabla productos ya contiene datos. No se insertaron duplicados.');
    }
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error.message);
    throw new Error(`Error al insertar datos de ejemplo: ${error.message}`);
  }
}

async function migrateProductos() {
  try {
    console.log('🚀 Iniciando migración de la tabla productos...');
    await createTable();
    console.log('🔄 Tabla productos creada. Procediendo a insertar datos de ejemplo...');
    await insertSampleData();
    console.log('✅ Migración completada con éxito.');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  }
}

// Ejemplo de ejecución (puedes eliminar esto si no es necesario)
(async () => {
  console.log('🏁 Iniciando script de migración...');
  await migrateProductos();
  console.log('🏁 Script de migración finalizado.');
})();