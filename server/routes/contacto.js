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
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

// POST contact message
router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    
    // Validate input
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ 
        error: 'Invalid input: nombre, email, and mensaje are required' 
      });
    }
    
    // Insert message
    await pool.query(
      'INSERT INTO contacto (nombre, email, telefono, mensaje, fecha) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
      [nombre, email, telefono || '', mensaje]
    );
    
    res.status(201).json({ message: 'Message sent successfully' });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;