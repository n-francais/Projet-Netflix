const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
  getSimilarMovies,
} = require('../controllers/movie.controller');

// const { protect } = require('../middlewares/auth.middleware');
// const { isAdmin } = require('../middlewares/admin.middleware');

// GET /api/movies/stats  -> statistiques (avant /:id pour éviter les conflits)
router.get('/stats', /* protect, isAdmin, */ getMovieStats);

// GET    /api/movies          -> tous les films
// POST   /api/movies          -> créer un film
router.get('/', getAllMovies);
router.post('/', /* protect, isAdmin, */ createMovie);

// GET    /api/movies/:id          -> un film par ID
// PUT    /api/movies/:id          -> mettre à jour un film
// DELETE /api/movies/:id          -> supprimer un film
router.get('/:id', getMovieById);
router.put('/:id', /* protect, isAdmin, */ updateMovie);
router.delete('/:id', /* protect, isAdmin, */ deleteMovie);

// GET /api/movies/:id/similar  -> films similaires
router.get('/:id/similar', getSimilarMovies);

module.exports = router;
