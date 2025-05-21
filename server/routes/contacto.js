const router = require('express').Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contacto:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - mensaje
 *       properties:
 *         nombre:
 *           type: string
 *           description: Name of the person
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         telefono:
 *           type: string
 *           description: Phone number
 *         mensaje:
 *           type: string
 *           description: Message content
 */

/**
 * @swagger
 * /api/contacto:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contacto'
 *     responses:
 *       200:
 *         description: Message submitted successfully
 *       500:
 *         description: Server error
 */

// POST contact message
router.post('/', async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;

  // Agregar console.log para depuración
  console.log('Request body:', req.body);

  try {
    const result = await pool.query(
      'INSERT INTO contacto (nombre, email, telefono, mensaje) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, telefono, mensaje]
    );
    res.status(200).json({ message: 'Message submitted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;