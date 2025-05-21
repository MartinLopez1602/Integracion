require('dotenv').config();
const { Client, Pool } = require('pg');

async function initDB() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  console.log('🔐 Verificando credenciales cargadas:');
  console.log('DB_USER:', DB_USER);
  console.log('DB_PASSWORD:', typeof DB_PASSWORD, DB_PASSWORD ? '[OK]' : '[VACÍA]');

  // se hace una constante para almacenar las credenciales de la base de datos
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
    // Verificar si la base de datos existe
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    // Verifico con el lenght, en el fondo si existe o no la base de datos
    if (result.rows.length === 0) {
      console.log(`📦 La base de datos "${DB_NAME}" no existe. Creándola...`);
      await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Base de datos "${DB_NAME}" creada exitosamente.`);
    } else {
      console.log(`📂 La base de datos "${DB_NAME}" ya existe.`);
    }

    await adminClient.end();

    // Cliente para la base creada (debe tener permisos de creación de tablas, por defecto todos los DML)
    const pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    const client = await pool.connect();

    console.log('DROP de tablas para reinserción de datos...');
    await client.query('BEGIN');
    await client.query(`
      DROP TABLE IF EXISTS carrito_producto CASCADE;
      DROP TABLE IF EXISTS carrito CASCADE;
      DROP TABLE IF EXISTS detalle_pedido CASCADE;
      DROP TABLE IF EXISTS pedido CASCADE;
      DROP TABLE IF EXISTS transaccion CASCADE;
      DROP TABLE IF EXISTS estado_pedido CASCADE;
      DROP TABLE IF EXISTS medio_pago CASCADE;
      DROP TABLE IF EXISTS cliente CASCADE;
      DROP TABLE IF EXISTS usuario CASCADE;
      DROP TABLE IF EXISTS empleado CASCADE;
      DROP TABLE IF EXISTS tipo_empleado CASCADE;
      DROP TABLE IF EXISTS inventario CASCADE;
      DROP TABLE IF EXISTS producto CASCADE;
      DROP TABLE IF EXISTS sucursal CASCADE;
      DROP TABLE IF EXISTS comuna CASCADE;
      DROP TABLE IF EXISTS region CASCADE;
      DROP TABLE IF EXISTS tipo_producto CASCADE;
    `);
    await client.query('COMMIT');
    console.log('✅ Tablas eliminadas correctamente.');
    console.log('🔧 Creando tablas nuevas...')
    // Crear tablas nuevas;
    // Se hace un console.log para indicar que se está ejecutando la migración de tablas
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
        stock_prod INTEGER,
        stock_min_prod INTEGER,
        estado_inventario VARCHAR(50),
        PRIMARY KEY (id_sucursal, id_prod)
      );

      CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        correo_user VARCHAR(150) UNIQUE NOT NULL,
        pass_hash_user TEXT NOT NULL,
        nombre_user VARCHAR(100),
        apellido_user VARCHAR(100),
        apellido2_user VARCHAR(100),
      );

      CREATE TABLE IF NOT EXISTS tipo_empleado (
        id_rol_emp SERIAL PRIMARY KEY,
        nom_rol_emp VARCHAR(20),
        desc_rol_emp VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS empleado (
        id_usuario INTEGER PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        id_sucursal INTEGER REFERENCES sucursal(id_sucursal),
        id_rol_emp INTEGER REFERENCES tipo_empleado(id_rol_emp),
        fecha_contrato DATE
      );

      CREATE TABLE IF NOT EXISTS tipo_pago (
        id_tipopago SERIAL PRIMARY KEY,
        nom_tipopago VARCHAR(50),
        desc_tipopago VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS medio_pago (
        id_medpago SERIAL PRIMARY KEY,
        id_tipopago INTEGER REFERENCES tipo_pago(id_tipopago),
        token_medpago TEXT,
        pred_medpago BOOLEAN,
      );

      CREATE TABLE IF NOT EXISTS cliente (
        id_cliente SERIAL PRIMARY KEY,
        id_usuario INTEGER REFERENCES usuario(id_usuario),
        id_tipo_pago INTEGER REFERENCES medio_pago(id_tipopago),
        direccion_cli TEXT,
        run_cli NUMERIC(9, 0) UNIQUE,
        dv_run_cli VARCHAR(1),
      );

      CREATE TABLE IF NOT EXISTS carrito (
        id_carrito SERIAL PRIMARY KEY,
        id_cliente INTEGER REFERENCES cliente(id_cliente),
        total DECIMAL(10,2),
        fecha_carrito TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS carrito_producto (
        id_carrito INTEGER REFERENCES carrito(id_carrito) ON DELETE CASCADE,
        id_prod INTEGER REFERENCES producto(id_prod),
        cantidad INTEGER,
        precio_unit DECIMAL(10,2),
        precio_total DECIMAL(10,2),
        fecha_carrito TIMESTAMP,
        PRIMARY KEY (id_carrito, id_prod)
      );

      CREATE TABLE IF NOT EXISTS estado_pedido (
        id_estado_ped SERIAL PRIMARY KEY,
        nom_estado_ped VARCHAR(50),
        desc_estado_ped VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS transaccion (
        id_trans SERIAL PRIMARY KEY,
        token_trans TEXT,
        fecha_trans TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pedido (
        id_pedido SERIAL PRIMARY KEY,
        id_estado_ped INTEGER REFERENCES estado_pedido(id_estado_ped),
        id_cliente INTEGER REFERENCES cliente(id_cliente),
        id_trans INTEGER REFERENCES transaccion(id_trans),
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_entrega DATE,
      );

      CREATE TABLE IF NOT EXISTS detalle_pedido (
        id_detalle_ped SERIAL PRIMARY KEY,
        id_pedido INTEGER REFERENCES pedido(id_pedido) ON DELETE CASCADE,
        id_producto INTEGER REFERENCES producto(id_prod),
        precio_unit DECIMAL(10,2),
        precio_total DECIMAL(10,2)
      );

    `);

    await client.query('COMMIT');
    console.log('✅ Migración de tablas completada con éxito.');

    // Insertar datos iniciales
    console.log('🚧 Insertando datos iniciales...');
    await client.query(`
      INSERT INTO region (nom_region) VALUES
        ('Región Metropolitana'),
        ('Región de Valparaíso'),
        ('Región del Libertador General Bernardo Higgins'),
        ('Región del Maule'),
        ('Región de Biobío'),
        ('Región de La Araucanía'),
        ('Región de Los Lagos'),
        ('Región de Aysén del General Carlos Ibáñez del Campo'),
        ('Región de Magallanes y de la Antártica Chilena')
      ON CONFLICT (nom_region) DO NOTHING;

      INSERT INTO comuna (id_region, nom_comuna) VALUES
        (1, 'Santiago'),
        (1, 'Las Condes'),
        (2, 'Valparaíso'),
        (3, 'Rancagua'),
        (4, 'Talca'),
        (5, 'Concepción'),
        (6, 'Temuco'),
        (7, 'Puerto Montt'),
        (8, 'Coyhaique'),
        (9, 'Punta Arenas')
      ON CONFLICT (nom_comuna) DO NOTHING;

      INSERT INTO tipo_producto (nombre_tipoprod, desc_tipoprod) VALUES
        ('Electrónica', 'Productos electrónicos como teléfonos, computadoras, etc.'),
        ('Ropa', 'Prendas de vestir y accesorios'),
        ('Alimentos', 'Productos alimenticios'),
        ('Muebles', 'Muebles y decoración para el hogar')
      ON CONFLICT (nombre_tipoprod) DO NOTHING;

      INSERT INTO tipo_empleado (nom_rol_emp, desc_rol_emp) VALUES
        ('Administrador', 'Rol con acceso completo al sistema'),
        ('Vendedor', 'Rol con acceso limitado a ventas y productos'),
        ('Bodega', 'Rol encargado de la gestión de inventario')
      ON CONFLICT (nom_rol_emp) DO NOTHING;

      INSERT INTO tipo_pago (nom_tipopago, desc_tipopago) VALUES
        ('Tarjeta de Crédito', 'Pago con tarjeta de crédito'),
        ('Transferencia', 'Pago mediante transferencia bancaria'),
        ('Efectivo', 'Pago en efectivo al momento de la compra')
      ON CONFLICT (nom_tipopago) DO NOTHING;

      INSERT INTO medio_pago (id_tipopago, token_medpago, pred_medpago) VALUES
        (1, 'token_visa', true),
        (2, 'token_transferencia', false),
        (3, 'token_efectivo', false)
      ON CONFLICT (token_medpago) DO NOTHING;

      INSERT INTO estado_pedido (nom_estado_ped, desc_estado_ped) VALUES
        ('Pendiente', 'Pedido pendiente de confirmación'),
        ('Confirmado', 'Pedido confirmado y en proceso de entrega'),
        ('Entregado', 'Pedido entregado al cliente'),
        ('Cancelado', 'Pedido cancelado por el cliente o la tienda')
      ON CONFLICT (nom_estado_ped) DO NOTHING;

      INSERT INTO usuario (correo_user, pass_hash_user, nombre_user, apellido_user, apellido2_user) VALUES
      ON CONFLICT (correo_user) DO NOTHING;

      INSERT INTO empleado (id_usuario, id_sucursal, id_rol_emp, fecha_contrato) VALUES
        (1, 1, 1, '2023-01-01'),
        (2, 2, 2, '2023-02-01'),
        (3, 3, 3, '2023-03-01')
      ON CONFLICT (id_usuario) DO NOTHING;

      INSERT INTO cliente (id_usuario, id_tipo_pago, direccion_cli, run_cli, dv_run_cli) VALUES
        (1, 1, 'Av. Siempre Viva 123', 12345678, '9'),
        (2, 2, 'Calle Falsa 456', 87654321, '0'),
        (3, 3, 'Paseo de la Reforma 789', 11223344, '5')
      ON CONFLICT (id_usuario) DO NOTHING;

      INSERT INTO carrito (id_cliente, total, fecha_carrito) VALUES
        (1, 0.00, '2023-10-01 12:00:00'),
        (2, 0.00, '2023-10-02 12:00:00'),
        (3, 0.00, '2023-10-03 12:00:00')
      ON CONFLICT (id_cliente) DO NOTHING;

      INSERT INTO carrito_producto (id_carrito, id_prod, cantidad, precio_unit, precio_total, fecha_carrito) VALUES
        (1, 1, 2, 500.00, 1000.00, '2023-10-01 12:00:00'),
        (2, 2, 1, 1500.00, 1500.00, '2023-10-02 12:00:00'),
        (3, 3, 3, 2000.00, 6000.00, '2023-10-03 12:00:00')
      ON CONFLICT (id_carrito, id_prod) DO NOTHING;
    `);

    console.log('✅ Datos iniciales insertados correctamente.');
    console.log('✅ Base de datos inicializada y lista para usar. 🛠️')
    await client.query('COMMIT');


    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err.message);
    process.exit(1);
  }
}



initDB();
