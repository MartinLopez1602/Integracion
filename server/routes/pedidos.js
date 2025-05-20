const router = require('express').Router();
const pool = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - sucursal_id
 *         - productos
 *       properties:
 *         sucursal_id:
 *           type: integer
 *           description: Branch ID making the order
 *         fecha_pedido:
 *           type: string
 *           format: date-time
 *           description: Order date
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - producto_id
 *               - cantidad
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Create a new order
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

// POST new order
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { sucursal_id, productos } = req.body;
    
    // Validate input
    if (!sucursal_id || !productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Invalid input: sucursal_id and productos array are required' });
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    // Create order
    const orderResult = await client.query(
      'INSERT INTO pedidos (sucursal_id, fecha_pedido) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id_pedido',
      [sucursal_id]
    );
    
    const pedidoId = orderResult.rows[0].id_pedido;
    
    // Add order items
    for (const item of productos) {
      await client.query(
        'INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad) VALUES ($1, $2, $3)',
        [pedidoId, item.producto_id, item.cantidad]
      );
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Pedido created successfully', 
      pedido_id: pedidoId 
    });
    
  } catch (err) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  } finally {
    // Release client
    client.release();
  }
});

module.exports = router;