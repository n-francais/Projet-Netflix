const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById } = require('../controllers/movieController');

// GET /api/movies        -> tous les films (+ filtres ?category= &isFeatured=)
router.get('/', getAllMovies);

// GET /api/movies/:id    -> un film par son ID MongoDB
router.get('/:id', getMovieById);

module.exports = router;
