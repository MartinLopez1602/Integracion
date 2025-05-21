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
 *   responses:
 *     CategoriasResponse:
 *       description: A list of categories
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Categoria'
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Returns all categorias
 *     tags: [Categorias]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of categories to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of categories to skip
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CategoriasResponse'
 *       500:
 *         description: Server error
 */

// GET all categorias with optional pagination
router.get('/', async (req, res) => {
  const { limit, offset } = req.query;

  // Validar parámetros de consulta
  const limitValue = parseInt(limit, 10) || 10; // Valor predeterminado: 10
  const offsetValue = parseInt(offset, 10) || 0; // Valor predeterminado: 0

  // Agregar console.log para depuración
  console.log(`Limit: ${limitValue}, Offset: ${offsetValue}`);

  if (limitValue < 1 || offsetValue < 0) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM categorias LIMIT $1 OFFSET $2',
      [limitValue, offsetValue]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;