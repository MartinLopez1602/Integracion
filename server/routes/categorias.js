const router = require('express').Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoProducto:
 *       type: object
 *       properties:
 *         id_tipoprod:
 *           type: integer
 *           description: ID del tipo de producto
 *         nombre_tipoprod:
 *           type: string
 *           description: Nombre del tipo de producto
 *         desc_tipoprod:
 *           type: string
 *           description: Descripción del tipo de producto
 *   responses:
 *     TiposProductoResponse:
 *       description: Lista de tipos de producto
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/TipoProducto'
 */

/**
 * @swagger
 * /api/tipos-producto:
 *   get:
 *     summary: Obtiene todos los tipos de producto
 *     tags: [Tipos de Producto]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de resultados a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de elementos a omitir desde el inicio
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TiposProductoResponse'
 *       500:
 *         description: Error interno del servidor
 */

// GET all tipo_producto with optional pagination
router.get('/', async (req, res) => {
  const { limit, offset } = req.query;

  const limitValue = parseInt(limit, 10) || 10;
  const offsetValue = parseInt(offset, 10) || 0;

  console.log(`Limit: ${limitValue}, Offset: ${offsetValue}`);

  if (limitValue < 1 || offsetValue < 0) {
    return res.status(400).json({ error: 'Parámetros de consulta inválidos' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM tipo_producto LIMIT $1 OFFSET $2',
      [limitValue, offsetValue]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al consultar tipo_producto:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
