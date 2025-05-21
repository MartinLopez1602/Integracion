const router = require('express').Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         id_categoria:
 *           type: integer
 *           description: The category ID
 *         nombre_categoria:
 *           type: string
 *           description: The category name
 *         descripcion:
 *           type: string
 *           description: Category description
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Returns all categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: The list of categorias
 *       500:
 *         description: Server error
 */

// GET all categorias
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias'); 
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;