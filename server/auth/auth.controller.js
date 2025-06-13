// server/auth/auth.controller.js
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const pool       = require('../config/db');
const { genAccess, genRefresh } = require('./token');

/* ---------- Registro cliente ---------- */
exports.register = async (req, res) => {
  const { correo, password, nombre, apellido, apellido2 } = req.body;

  // 1️⃣ comprobar duplicado
  const dup = await pool.query(
    'SELECT 1 FROM usuario WHERE correo_user = $1',
    [correo]
  );
  if (dup.rowCount)
    return res.status(409).json({ error: 'Correo ya registrado' });

  // 2️⃣ insertar en usuario
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    `INSERT INTO usuario (correo_user, pass_hash_user, nombre_user, apellido_user, apellido2_user)
     VALUES ($1,$2,$3,$4,$5) RETURNING id_usuario, correo_user`,
    [correo, hash, nombre, apellido, apellido2]
  );
  const usuario = rows[0];

  // 3️⃣ (opcional) insertar en cliente para habilitar carrito
  await pool.query(
    'INSERT INTO cliente (id_usuario) VALUES ($1)',
    [usuario.id_usuario]
  );

  res.status(201).json({ message: 'Registro exitoso' });
};

/* ---------- Login (todos los roles) ---------- */
exports.login = async (req, res) => {
  const { correo, password } = req.body;

  // buscar en usuario
  const { rows } = await pool.query(
    'SELECT id_usuario, correo_user, pass_hash_user FROM usuario WHERE correo_user = $1',
    [correo]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.pass_hash_user)))
    return res.status(401).json({ error: 'Credenciales inválidas' });

  // detectar rol principal: administrador, empleado o cliente
  let rol = 'cliente';
  const isAdmin = await pool.query(
    'SELECT 1 FROM administrador WHERE id_admin = $1',
    [user.id_usuario]
  );
  if (isAdmin.rowCount) rol = 'admin';
  else {
    const isEmpleado = await pool.query(
      'SELECT 1 FROM empleado WHERE id_usuario = $1',
      [user.id_usuario]
    );
    if (isEmpleado.rowCount) rol = 'empleado';
  }

  const payload = { sub: user.id_usuario, correo: user.correo_user, rol };
  res.json({
    access:  genAccess(payload),
    refresh: genRefresh(payload),
  });
};

/* ---------- Refresh ---------- */
exports.refreshToken = (req, res) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ error: 'Falta refresh token' });

  try {
    const decoded = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);
    const access  = genAccess({
      sub: decoded.sub,
      correo: decoded.correo,
      rol: decoded.rol,
    });
    res.json({ access });
  } catch {
    res.status(401).json({ error: 'Refresh token inválido' });
  }
};
