// server/auth/auth.routes.js
const router = require('express').Router();
const { register, login, refreshToken } = require('./auth.controller');
const authenticate = require('./authenticate.js');   // 👈 importa el middleware

router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refreshToken);

/* NUEVO endpoint protegido */
router.get('/me', authenticate, (req, res) => {
  // req.user viene del middleware
  const { sub: id, correo, rol } = req.user;
  res.json({ id, correo, rol });
});

module.exports = router;
