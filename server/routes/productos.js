const router = require('express').Router();
const pool = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The producto ID
 *         name:
 *           type: string
 *           description: The producto name
 *         price:
 *           type: number
 *           description: The producto price
 *         description:
 *           type: string
 *           description: The producto description
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
 * /api/productos/{id}:
 *   get:
 *     summary: Get a producto by ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
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

// GET producto by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]); // Change table name if needed
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add more routes (POST, PUT, DELETE) as needed

module.exports = router;