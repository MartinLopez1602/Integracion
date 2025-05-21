const router = require('express').Router();
const { WebpayPlus } = require('transbank-sdk');
const pool = require('../config/db');

// Inicializar WebPay en modo de integración (desarrollo)
const webpay = new WebpayPlus.Transaction(
  '597055555532', 
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  'TEST'
);

/**
 * @swagger
 * /api/webpay/create:
 *   post:
 *     summary: Iniciar una transacción WebPay
 *     tags: [WebPay]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyOrder
 *               - sessionId
 *               - amount
 *               - returnUrl
 *             properties:
 *               buyOrder:
 *                 type: string
 *                 description: Número único de orden de compra
 *               sessionId:
 *                 type: string
 *                 description: Identificador de sesión
 *               amount:
 *                 type: number
 *                 description: Monto a pagar
 *               returnUrl:
 *                 type: string
 *                 description: URL de retorno después del pago
 */
router.post('/create', async (req, res) => {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = req.body;

    console.log('Datos recibidos:', { buyOrder, sessionId, amount, returnUrl });
    
    // Validar campos obligatorios
    if (!buyOrder || !sessionId || !amount || !returnUrl) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios (buyOrder, sessionId, amount, returnUrl)' 
      });
    }

    // MODO SIMULACIÓN PARA DESARROLLO
    // Esto evita la validación de URL que está causando el error
    console.log('Usando modo simulación para desarrollo...');
    
    // Generar token simulado
    const simulatedToken = `SIM-${Date.now()}`;
    
    // Guardar en la base de datos
    const result = await pool.query(
      'INSERT INTO transaccion (token_trans, fecha_trans) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id_trans',
      [simulatedToken]
    );
    
    // Responder con datos simulados
    return res.json({
      url: `http://localhost:3000/webpay-simulator?token=${simulatedToken}&amount=${amount}`,
      token: simulatedToken
    });

    /* Comentamos el código real de WebPay para desarrollo
    console.log('Iniciando creación de transacción en WebPay...');
    const response = await webpay.create(buyOrder, sessionId, amount, returnUrl);
    console.log('Respuesta de WebPay:', response);
    
    await pool.query(
      'INSERT INTO transaccion (token_trans, fecha_trans) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id_trans',
      [response.token]
    );
    
    res.json({
      url: response.url,
      token: response.token
    });
    */
    
  } catch (error) {
    console.error('Error al crear transacción WebPay:', error.message);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});
/**
 * @swagger
 * /api/webpay/commit:
 *   get:
 *     summary: Confirmar una transacción WebPay
 *     tags: [WebPay]
 *     parameters:
 *       - in: query
 *         name: token_ws
 *         required: true
 *         description: Token de la transacción WebPay
 *         schema:
 *           type: string
 */
router.get('/commit', async (req, res) => {
  try {
    const { token_ws } = req.query;
    
    console.log('Token recibido para commit:', token_ws);
    
    if (!token_ws) {
      return res.status(400).json({ error: 'Token no proporcionado' });
    }
    
    // Verificar si es un token simulado (para desarrollo)
    if (token_ws.startsWith('SIM-')) {
      console.log('Procesando token simulado para commit...');
      
      // Simulamos una respuesta exitosa para el flujo de desarrollo
      const simulatedResponse = {
        status: 'AUTHORIZED',
        amount: 1000,
        buy_order: 'simulated-order',
        session_id: 'simulated-session',
        card_detail: {
          card_number: '1234'
        },
        accounting_date: new Date().toISOString().split('T')[0],
        transaction_date: new Date().toISOString(),
        authorization_code: 'SIM123',
        payment_type_code: 'VN',
        installments_number: 0,
        vci: 'TSY'
      };
      
      console.log('Respuesta simulada de commit:', simulatedResponse);
      
      // Actualizar la transacción en tu BD
      await pool.query(
        'UPDATE pedido SET id_estado_ped = 2 WHERE id_pedido = (SELECT id_pedido FROM pedido WHERE id_estado_ped = 1 ORDER BY fecha_pedido DESC LIMIT 1)'
      );
      
      // Redireccionar al cliente a la página de éxito
      return res.redirect('http://localhost:3000/pago-exitoso?token=' + token_ws);
    }
    
    // Procesamiento normal para tokens reales de WebPay
    const response = await webpay.commit(token_ws);
    console.log('Respuesta de commit:', response);
    
    // Si el pago fue exitoso, actualizar tu base de datos
    if (response.status === 'AUTHORIZED') {
      // Actualizar la transacción en tu BD
      await pool.query(
        'UPDATE pedido SET id_estado_ped = 2 WHERE id_trans = (SELECT id_trans FROM transaccion WHERE token_trans = $1)',
        [token_ws]
      );
      
      // Redireccionar al cliente a la página de éxito
      return res.redirect('http://localhost:3000/pago-exitoso?token=' + token_ws);
    } else {
      // Redireccionar al cliente a la página de error
      return res.redirect('http://localhost:3000/pago-fallido?token=' + token_ws);
    }
    
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Error al confirmar transacción WebPay:', error.message);
    res.redirect('http://localhost:3000/pago-fallido');
  }
});

module.exports = router;