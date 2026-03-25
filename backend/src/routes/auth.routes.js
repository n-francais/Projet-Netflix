const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/me', protect, getMe);

module.exports = router;
