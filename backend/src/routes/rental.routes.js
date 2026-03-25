const express = require('express');
const router = express.Router();
const {
  createRental,
  getMyRentals,
  getAllRentals,
  cancelRental,
  getRentalStats,
  getRecommendations,
} = require('../controllers/rental.controller');

const { protect } = require('../middlewares/auth.middleware');
// const { isAdmin } = require('../middlewares/admin.middleware');

// GET  /api/rentals/stats           -> statistiques
router.get('/stats', getRentalStats);

// GET  /api/rentals/recommendations?userId= -> recommandations personnalisées
router.get('/recommendations', getRecommendations);

// GET  /api/rentals/my-rentals      -> locations de l'utilisateur connecté
router.get('/my-rentals', protect, getMyRentals);

// GET  /api/rentals            -> toutes les locations (admin)
// POST /api/rentals            -> créer une location
router.get('/', getAllRentals);
router.post('/', protect, createRental);

// DELETE /api/rentals/:id      -> annuler une location
router.delete('/:id', protect, cancelRental);

module.exports = router;
