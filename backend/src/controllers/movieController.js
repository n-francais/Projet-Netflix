const Movie = require('../models/Movie');

// @desc    Récupérer tous les films
// @route   GET /api/movies
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const { category, isFeatured } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des films',
      error: error.message,
    });
  }
};

// @desc    Récupérer un film par son ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    // ID MongoDB invalide (pas un ObjectId valide)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de film invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du film',
      error: error.message,
    });
  }
};

module.exports = { getAllMovies, getMovieById };
