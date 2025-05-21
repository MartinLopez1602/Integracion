require('dotenv').config();
const { Client, Pool } = require('pg');

async function initDB() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  console.log('🔐 Verificando credenciales cargadas:');
  console.log('DB_USER:', DB_USER);
  console.log('DB_PASSWORD:', typeof DB_PASSWORD, DB_PASSWORD ? '[OK]' : '[VACÍA]');

  // Cliente para crear la base de datos
  const adminClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres'
  });

  try {
    await adminClient.connect();
    console.log('✅ Conectado a PostgreSQL como administrador.');

    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (result.rows.length === 0) {
      console.log(`📦 La base de datos "${DB_NAME}" no existe. Creándola...`);
      await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Base de datos "${DB_NAME}" creada exitosamente.`);
    } else {
      console.log(`📂 La base de datos "${DB_NAME}" ya existe.`);
    }

    await adminClient.end();

    // Cliente para la base creada
    const pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    const client = await pool.connect();

    console.log('🚧 Ejecutando migración de tablas...');
    await client.query('BEGIN');

    // Creación de tablas
    await client.query(`
      CREATE TABLE IF NOT EXISTS region (
        id_region SERIAL PRIMARY KEY,
        nom_region VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS comuna (
        id_comuna SERIAL PRIMARY KEY,
        id_region INTEGER REFERENCES region(id_region),
        nom_comuna VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sucursal (
        id_sucursal SERIAL PRIMARY KEY,
        nombre_sucursal VARCHAR(100) NOT NULL,
        direccion_sucursal VARCHAR(255) NOT NULL,
        id_comuna INTEGER REFERENCES comuna(id_comuna)
      );

      CREATE TABLE IF NOT EXISTS tipo_producto (
        id_tipoprod SERIAL PRIMARY KEY,
        nombre_tipoprod VARCHAR(100) NOT NULL,
        desc_tipoprod TEXT
      );

      CREATE TABLE IF NOT EXISTS producto (
        id_prod SERIAL PRIMARY KEY,
        nombre_prod VARCHAR(100) NOT NULL,
        precio_prod DECIMAL(10, 2) NOT NULL,
        stock_prod INTEGER,
        id_tipoprod INTEGER REFERENCES tipo_producto(id_tipoprod)
      );

      CREATE TABLE IF NOT EXISTS inventario (
        id_sucursal INTEGER REFERENCES sucursal(id_sucursal),
        id_prod INTEGER REFERENCES producto(id_prod),
        stock_min INTEGER,
        estado_inventario VARCHAR(50),
        PRIMARY KEY (id_sucursal, id_prod)
      );

      CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        correo_user VARCHAR(150) UNIQUE NOT NULL,
        user_hash_user TEXT NOT NULL,
        nombre_user VARCHAR(100),
        apellido_user VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS tipo_empleado (
        id_rol_emp SERIAL PRIMARY KEY,
        rut_empleado VARCHAR(20),
        desc_rol_emp VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS empleado (
        id_usuario INTEGER PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        id_sucursal INTEGER REFERENCES sucursal(id_sucursal),
        id_rol_emp INTEGER REFERENCES tipo_empleado(id_rol_emp),
        fecha_contrato DATE
      );

      CREATE TABLE IF NOT EXISTS cliente (
        id_cliente SERIAL PRIMARY KEY,
        id_usuario INTEGER REFERENCES usuario(id_usuario),
        direccion_cli TEXT,
        run_cli VARCHAR(20)
      );

      CREATE TABLE IF NOT EXISTS carrito (
        id_carrito SERIAL PRIMARY KEY,
        id_cliente INTEGER REFERENCES cliente(id_cliente),
        total DECIMAL(10,2),
        fecha_cierre TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS carrito_producto (
        id_carrito INTEGER REFERENCES carrito(id_carrito) ON DELETE CASCADE,
        id_prod INTEGER REFERENCES producto(id_prod),
        cantidad INTEGER,
        precio_unit DECIMAL(10,2),
        PRIMARY KEY (id_carrito, id_prod)
      );

      CREATE TABLE IF NOT EXISTS estado_pedido (
        id_estado_ped SERIAL PRIMARY KEY,
        nom_estado_ped VARCHAR(50),
        desc_estado_ped TEXT
      );

      CREATE TABLE IF NOT EXISTS pedido (
        id_pedido SERIAL PRIMARY KEY,
        id_estado_ped INTEGER REFERENCES estado_pedido(id_estado_ped),
        id_cliente INTEGER REFERENCES cliente(id_cliente),
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS detalle_pedido (
        id_detalle_ped SERIAL PRIMARY KEY,
        id_pedido INTEGER REFERENCES pedido(id_pedido) ON DELETE CASCADE,
        id_producto INTEGER REFERENCES producto(id_prod),
        precio_unit DECIMAL(10,2),
        precio_total DECIMAL(10,2)
      );

      CREATE TABLE IF NOT EXISTS medio_pago (
        id_tipopago SERIAL PRIMARY KEY,
        token_tu_met_pago TEXT,
        pref_met_pago VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS transaccion (
        id_trans SERIAL PRIMARY KEY,
        token_trans TEXT,
        fecha_trans TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Migración completada con éxito.');

    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err.message);
    process.exit(1);
  }
}

initDB();
