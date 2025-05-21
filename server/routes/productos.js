const router = require('express').Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         id_prod:
 *           type: integer
 *           description: The producto ID
 *         nombre_prod:
 *           type: string
 *           description: The producto name
 *         precio_prod:
 *           type: number
 *           description: The producto price
 *         stock_prod:
 *           type: integer
 *           description: Available stock
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Returns all productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: The list of productos
 *       500:
 *         description: Server error
 */

// GET all productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos'); 
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
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
 *         description: The producto ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The producto details
 *       404:
 *         description: Producto not found
 *       500:
 *         description: Server error
 */

// GET producto by codigo (id_prod)
router.get('/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const result = await pool.query('SELECT * FROM productos WHERE id_prod = $1', [codigo]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;