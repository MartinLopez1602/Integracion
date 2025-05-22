const router = require('express').Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Stock:
 *       type: object
 *       properties:
 *         id_prod:
 *           type: integer
 *           description: ID del producto
 *         nombre_prod:
 *           type: string
 *           description: Nombre del producto
 *         stock_min:
 *           type: integer
 *           description: Stock mínimo en sucursal
 *         estado_inventario:
 *           type: string
 *           description: Estado del inventario
 */

/**
 * @swagger
 * /api/sucursales/{id}/stock:
 *   get:
 *     summary: Obtener el inventario de una sucursal
 *     tags: [Sucursales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario de la sucursal
 *       404:
 *         description: Sucursal no encontrada
 *       500:
 *         description: Error del servidor
 */

router.get('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID de sucursal recibido:', id);

    // Validar existencia de la sucursal
    const sucursal = await pool.query(
      'SELECT * FROM sucursal WHERE id_sucursal = $1',
      [id]
    );

    if (sucursal.rows.length === 0) {
      console.log('Sucursal no encontrada para el ID:', id);
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }

    // Consultar inventario para la sucursal
    const result = await pool.query(
      `SELECT 
         i.id_prod, 
         p.nombre_prod, 
         i.stock_min, 
         i.estado_inventario
       FROM inventario i
       JOIN producto p ON i.id_prod = p.id_prod
       WHERE i.id_sucursal = $1`,
      [id]
    );

    console.log('Resultado de la consulta de inventario:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener el inventario:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
