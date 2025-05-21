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
