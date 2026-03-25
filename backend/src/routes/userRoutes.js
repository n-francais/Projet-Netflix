// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

// On définit la route et on passe la fonction du contrôleur
router.get('/:id', userCtrl.getUserProfile);
router.post('/', userCtrl.createUser);

module.exports = router;
