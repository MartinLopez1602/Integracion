const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_prod,
        p.nombre_prod,
        p.precio_prod,
        p.stock_prod,
        tp.nombre_tipoprod AS tipo_producto
      FROM producto p
      LEFT JOIN tipo_producto tp ON p.id_tipoprod = tp.id_tipoprod
    `);

    console.log('Productos obtenidos:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET productos destacados
router.get('/destacados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_prod, nombre_prod, precio_prod, stock_prod
      FROM producto
      WHERE destacado_prod = true
      LIMIT 4
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos destacados:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * @swagger
 * /api/productos/{codigo}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    console.log('Código recibido:', codigo);

    const result = await pool.query(`
      SELECT 
        p.id_prod,
        p.nombre_prod,
        p.precio_prod,
        p.stock_prod,
        tp.nombre_tipoprod AS tipo_producto
      FROM producto p
      LEFT JOIN tipo_producto tp ON p.id_tipoprod = tp.id_tipoprod
      WHERE p.id_prod = $1
    `, [codigo]);

    console.log('Resultado de la consulta:', result.rows);

    if (result.rows.length === 0) {
      console.log('Producto no encontrado para el código:', codigo);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener producto por código:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_prod
 *               - precio_prod
 *               - stock_prod
 *               - id_tipoprod
 *             properties:
 *               nombre_prod:
 *                 type: string
 *               precio_prod:
 *                 type: number
 *               stock_prod:
 *                 type: integer
 *               id_tipoprod:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  const { nombre_prod, precio_prod, stock_prod, id_tipoprod } = req.body;

  if (!nombre_prod || !precio_prod || !stock_prod || !id_tipoprod) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO producto (nombre_prod, precio_prod, stock_prod, id_tipoprod)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre_prod, precio_prod, stock_prod, id_tipoprod]
    );

    console.log('Producto creado:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear producto:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
