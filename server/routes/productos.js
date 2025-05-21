const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Asegúrate de que esta ruta sea correcta

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Get all productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       500:
 *         description: Error del servidor
 */

// GET all productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    // Log de los productos obtenidos
    console.log('Productos obtenidos:', result.rows);
    res.json(result.rows);
  } catch (err) {
    // Log del error
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/productos/{codigo}:
 *   get:
 *     summary: Get a producto by codigo
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

// GET producto by codigo (id_prod)
router.get('/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;

    // Log del parámetro recibido
    console.log('Código recibido:', codigo);

    const result = await pool.query('SELECT * FROM productos WHERE id_prod = $1', [codigo]);

    // Log del resultado de la consulta
    console.log('Resultado de la consulta:', result.rows);

    if (result.rows.length === 0) {
      console.log('Producto no encontrado para el código:', codigo);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    // Log del error
    console.error('Error al obtener producto por código:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;