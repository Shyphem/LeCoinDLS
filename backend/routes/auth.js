// routes/auth.js
const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

/**
 * @route POST /auth/login
 * @desc Authentifie un utilisateur et retourne un token JWT
 * @access Public
 * @body { mail: string, password: string }
 * @response { message: string, token: string }
 * @error { message: string }
 */
router.post('/login', login);

module.exports = router;