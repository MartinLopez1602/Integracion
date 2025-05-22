const router = require('express').Router();
const axios = require('axios');

/**
 * @swagger
 * components:
 *   schemas:
 *     ConversionResult:
 *       type: object
 *       properties:
 *         monto_original:
 *           type: number
 *           description: Original amount
 *         moneda_origen:
 *           type: string
 *           description: Source currency code
 *         monto_clp:
 *           type: number
 *           description: Converted amount in CLP
 *         tasa_conversion:
 *           type: number
 *           description: Exchange rate applied
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Date and time of conversion
 */

/**
 * @swagger
 * /api/moneda/convertir:
 *   get:
 *     summary: Convert currency to CLP
 *     tags: [Moneda]
 *     parameters:
 *       - in: query
 *         name: monto
 *         schema:
 *           type: number
 *         required: true
 *         description: Amount to convert
 *       - in: query
 *         name: moneda
 *         schema:
 *           type: string
 *         required: true
 *         description: Source currency code
 *     responses:
 *       200:
 *         description: Conversion result
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */

// GET currency conversion
router.get('/convertir', async (req, res) => {
  const { monto, moneda } = req.query;

  // Agregar console.log para depuración
  console.log('Query parameters:', req.query);

  if (!monto || !moneda) {
    return res.status(400).json({ error: 'Missing required query parameters: monto or moneda' });
  }

  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${moneda}`);
    const tasaConversion = response.data.rates.CLP;
    const montoCLP = monto * tasaConversion;

    res.json({
      monto_original: parseFloat(monto),
      moneda_origen: moneda,
      monto_clp: montoCLP,
      tasa_conversion: tasaConversion,
      fecha: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching exchange rate:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;