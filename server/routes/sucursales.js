const router = require('express').Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Stock:
 *       type: object
 *       properties:
 *         producto_id:
 *           type: integer
 *           description: The producto ID
 *         nombre_producto:
 *           type: string
 *           description: Product name
 *         cantidad:
 *           type: integer
 *           description: Available quantity
 */

/**
 * @swagger
 * /api/sucursales/{id}/stock:
 *   get:
 *     summary: Get stock information for a specific branch
 *     tags: [Sucursales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The branch ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock information for the branch
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */

// GET stock by sucursal
router.get('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;

    // Log del ID de la sucursal recibido
    console.log('ID de sucursal recibido:', id);
    
    // Verify branch exists
    const sucursal = await pool.query('SELECT * FROM sucursales WHERE id_sucursal = $1', [id]);
    console.log('Resultado de la consulta de sucursal:', sucursal.rows);

    if (sucursal.rows.length === 0) {
      console.log('Sucursal no encontrada para el ID:', id);
      return res.status(404).json({ error: 'Sucursal not found' });
    }
    
    // Get stock data
    const result = await pool.query(
      `SELECT s.producto_id, p.nombre_prod AS nombre_producto, s.cantidad
       FROM stock s
       JOIN productos p ON s.producto_id = p.id_prod
       WHERE s.sucursal_id = $1`, 
      [id]
    );

    // Log del resultado de la consulta de stock
    console.log('Resultado de la consulta de stock:', result.rows);
    
    res.json(result.rows);
  } catch (err) {
    // Log del error
    console.error('Error al obtener el stock:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;