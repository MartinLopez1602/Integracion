require('dotenv').config();
const { Client, Pool } = require('pg');

async function initDB() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  console.log('🔐 Verificando credenciales cargadas:');
  console.log('DB_USER:', DB_USER);
  console.log('DB_PASSWORD:', typeof DB_PASSWORD, DB_PASSWORD ? '[OK]' : '[VACÍA]');

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

    const pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    const client = await pool.connect();

    console.log('🔧 Eliminando tablas existentes...');
    await client.query('BEGIN');
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);
    await client.query('COMMIT');
    console.log('✅ Tablas eliminadas y esquema reiniciado.');

    console.log('🔧 Creando tablas nuevas...');
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE region (
        id_region SERIAL PRIMARY KEY,
        nom_region VARCHAR(100) NOT NULL
      );

      CREATE TABLE comuna (
        id_comuna SERIAL PRIMARY KEY,
        id_region INTEGER REFERENCES region(id_region),
        nom_comuna VARCHAR(100) NOT NULL
      );

      CREATE TABLE sucursal (
        id_sucursal SERIAL PRIMARY KEY,
        nombre_sucursal VARCHAR(100) NOT NULL,
        direccion_sucursal VARCHAR(255) NOT NULL,
        id_comuna INTEGER REFERENCES comuna(id_comuna)
      );

      CREATE TABLE tipo_producto (
        id_tipoprod SERIAL PRIMARY KEY,
        nombre_tipoprod VARCHAR(100) NOT NULL,
        desc_tipoprod TEXT
      );

      CREATE TABLE producto (
        id_prod SERIAL PRIMARY KEY,
        nombre_prod VARCHAR(100) NOT NULL,
        precio_prod DECIMAL(10, 2) NOT NULL,
        stock_prod INTEGER,
        id_tipoprod INTEGER REFERENCES tipo_producto(id_tipoprod)
      );

      CREATE TABLE inventario (
        id_sucursal INTEGER REFERENCES sucursal(id_sucursal),
        id_prod INTEGER REFERENCES producto(id_prod),
        stock_prod INTEGER,
        stock_min_prod INTEGER,
        estado_inventario VARCHAR(50),
        PRIMARY KEY (id_sucursal, id_prod)
      );

      CREATE TABLE usuario (
        id_usuario SERIAL PRIMARY KEY,
        correo_user VARCHAR(150) UNIQUE NOT NULL,
        pass_hash_user TEXT NOT NULL,
        nombre_user VARCHAR(100),
        apellido_user VARCHAR(100),
        apellido2_user VARCHAR(100)
      );

      CREATE TABLE tipo_empleado (
        id_rol_emp SERIAL PRIMARY KEY,
        nom_rol_emp VARCHAR(20),
        desc_rol_emp VARCHAR(100)
      );

      CREATE TABLE empleado (
        id_usuario INTEGER PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        id_sucursal INTEGER REFERENCES sucursal(id_sucursal),
        id_rol_emp INTEGER REFERENCES tipo_empleado(id_rol_emp),
        fecha_contrato DATE
      );

      CREATE TABLE tipo_pago (
        id_tipopago SERIAL PRIMARY KEY,
        nom_tipopago VARCHAR(50),
        desc_tipopago VARCHAR(100)
      );

      CREATE TABLE medio_pago (
        id_medpago SERIAL PRIMARY KEY,
        id_tipopago INTEGER REFERENCES tipo_pago(id_tipopago),
        token_medpago TEXT,
        pred_medpago BOOLEAN
      );

      CREATE TABLE cliente (
        id_cliente SERIAL PRIMARY KEY,
        id_usuario INTEGER REFERENCES usuario(id_usuario),
        id_medpago INTEGER REFERENCES medio_pago(id_medpago),
        direccion_cli TEXT,
        run_cli NUMERIC(9, 0) UNIQUE,
        dv_run_cli VARCHAR(1)
      );

      CREATE TABLE carrito (
        id_carrito SERIAL PRIMARY KEY,
        id_cliente INTEGER REFERENCES cliente(id_cliente),
        total DECIMAL(10,2),
        fecha_carrito TIMESTAMP
      );

      CREATE TABLE carrito_producto (
        id_carrito INTEGER REFERENCES carrito(id_carrito) ON DELETE CASCADE,
        id_prod INTEGER REFERENCES producto(id_prod),
        cantidad INTEGER,
        precio_unit DECIMAL(10,2),
        precio_total DECIMAL(10,2),
        fecha_carrito TIMESTAMP,
        PRIMARY KEY (id_carrito, id_prod)
      );

      CREATE TABLE estado_pedido (
        id_estado_ped SERIAL PRIMARY KEY,
        nom_estado_ped VARCHAR(50),
        desc_estado_ped VARCHAR(100)
      );

      CREATE TABLE transaccion (
        id_trans SERIAL PRIMARY KEY,
        token_trans TEXT,
        fecha_trans TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE pedido (
        id_pedido SERIAL PRIMARY KEY,
        id_estado_ped INTEGER REFERENCES estado_pedido(id_estado_ped),
        id_cliente INTEGER REFERENCES cliente(id_cliente),
        id_trans INTEGER REFERENCES transaccion(id_trans),
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_entrega DATE
      );

      CREATE TABLE detalle_pedido (
        id_detalle_ped SERIAL PRIMARY KEY,
        id_pedido INTEGER REFERENCES pedido(id_pedido) ON DELETE CASCADE,
        id_producto INTEGER REFERENCES producto(id_prod),
        precio_unit DECIMAL(10,2),
        precio_total DECIMAL(10,2)
      );

      CREATE TABLE contacto (
        id_contacto SERIAL PRIMARY KEY,
        nombre_contacto VARCHAR(100) NOT NULL,
        correo_contacto VARCHAR(150) NOT NULL,
        mensaje_contacto TEXT NOT NULL,
        fecha_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    `);
    await client.query('COMMIT');
    console.log('✅ Migración de tablas completada con éxito.');

    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err.message);
    process.exit(1);
  }
}

initDB();
