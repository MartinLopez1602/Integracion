const router = require('express').Router();
const { register, login, refreshToken } = require('./auth.controller');

router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refreshToken);

module.exports = router;
