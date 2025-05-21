const router = require('express').Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - cliente_id
 *         - estado_id
 *         - productos
 *       properties:
 *         cliente_id:
 *           type: integer
 *           description: ID del cliente
 *         estado_id:
 *           type: integer
 *           description: ID del estado inicial del pedido
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - producto_id
 *               - cantidad
 *               - precio_unitario
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *                 format: float
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */

router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    const { cliente_id, estado_id, productos } = req.body;

    console.log('Request body:', req.body);

    // Validación
    if (!cliente_id || !estado_id || !productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'cliente_id, estado_id y productos son obligatorios' });
    }

    // Iniciar transacción
    await client.query('BEGIN');

    // Insertar pedido
    const pedidoResult = await client.query(
      'INSERT INTO pedido (id_cliente, id_estado_ped, fecha_pedido) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id_pedido',
      [cliente_id, estado_id]
    );

    const pedidoId = pedidoResult.rows[0].id_pedido;
    console.log('Pedido creado con ID:', pedidoId);

    // Insertar detalle
    for (const item of productos) {
      if (!item.producto_id || !item.cantidad || !item.precio_unitario) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Cada producto debe incluir producto_id, cantidad y precio_unitario' });
      }

      const precioTotal = item.cantidad * item.precio_unitario;

      await client.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unit, precio_total) 
         VALUES ($1, $2, $3, $4, $5)`,
        [pedidoId, item.producto_id, item.cantidad, item.precio_unitario, precioTotal]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido_id: pedidoId
    });

  } catch (err) {
    console.log('Error en transacción:', err.message);
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error del servidor' });
  } finally {
    client.release();
  }
});

module.exports = router;
