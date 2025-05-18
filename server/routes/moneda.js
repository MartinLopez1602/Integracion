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
 *         required: true
 *         description: Amount to convert
 *         schema:
 *           type: number
 *       - in: query
 *         name: de
 *         required: true
 *         description: Source currency code (USD, EUR, etc.)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversion successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversionResult'
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */

// Helper function to map currency codes to mindicador.cl endpoints
const getCurrencyEndpoint = (code) => {
  const currencyMap = {
    'USD': 'dolar',
    'EUR': 'euro',
    'UF': 'uf',
    'UTM': 'utm',
    'IPC': 'ipc',
    'GBP': 'libra_cobre'
  };
  
  return currencyMap[code] || null;
};

// GET /api/moneda/convertir - Convert currency to CLP
router.get('/convertir', async (req, res) => {
  try {
    const { monto, de } = req.query;
    
    // Validate input
    if (!monto || !de || isNaN(parseFloat(monto))) {
      return res.status(400).json({ 
        error: 'Parámetros inválidos. Se requiere monto (número) y moneda origen (de)' 
      });
    }
    
    // Convert to uppercase for API compatibility
    const sourceCurrency = de.toUpperCase();
    const amount = parseFloat(monto);
    
    // Get the appropriate endpoint for mindicador.cl
    const currencyEndpoint = getCurrencyEndpoint(sourceCurrency);
    
    if (!currencyEndpoint) {
      return res.status(400).json({ 
        error: `La moneda ${sourceCurrency} no está soportada. Monedas disponibles: USD, EUR, UF, UTM, IPC, GBP` 
      });
    }
    
    // Fetch latest exchange rates from mindicador.cl
    const response = await axios.get(`https://mindicador.cl/api/${currencyEndpoint}`);
    
    // Check if API returned data correctly
    if (!response.data || !response.data.serie || !response.data.serie[0]) {
      throw new Error(`No se encontraron tasas de conversión para ${sourceCurrency} a CLP`);
    }
    
    // Get the CLP exchange rate (mindicador.cl returns CLP per unit of the foreign currency)
    const exchangeRate = response.data.serie[0].valor;
    
    // Calculate converted amount
    const convertedAmount = amount * exchangeRate;
    
    // Return result
    res.json({
      monto_original: amount,
      moneda_origen: sourceCurrency,
      monto_clp: convertedAmount,
      tasa_conversion: exchangeRate,
      fecha: response.data.serie[0].fecha || new Date().toISOString()
    });
    
  } catch (err) {
    console.error('Error en conversión de moneda:', err.message);
    res.status(500).json({ 
      error: 'Error al realizar la conversión de moneda', 
      detalle: err.message 
    });
  }
});

module.exports = router;