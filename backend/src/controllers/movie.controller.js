const Movie = require('../models/Movie');

// @desc    Récupérer tous les films (pagination, tri, filtres)
// @route   GET /api/movies?search=&category=&year=&page=&limit=&sort=
// @access  Public
exports.getAllMovies = async (req, res) => {
  try {
    const {
      search,
      category,
      year,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Construction du filtre
    const filter = {};
    if (category) filter.category = category;
    if (year) filter.year = Number(year);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Tri
    const sortOption = {};
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    sortOption[sortField] = sort.startsWith('-') ? -1 : 1;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Movie.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
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
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
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

// @desc    Créer un nouveau film
// @route   POST /api/movies
// @access  Public
exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du film',
      error: error.message,
    });
  }
};

// @desc    Mettre à jour un film
// @route   PUT /api/movies/:id
// @access  Public
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de film invalide',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du film',
      error: error.message,
    });
  }
};

// @desc    Supprimer un film
// @route   DELETE /api/movies/:id
// @access  Public
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Film supprimé avec succès',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de film invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du film',
      error: error.message,
    });
  }
};

// @desc    Statistiques des films (par catégorie, note moyenne, total)
// @route   GET /api/movies/stats
// @access  Public
exports.getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          avgDuration: { $avg: '$duration' },
          minYear: { $min: '$year' },
          maxYear: { $max: '$year' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totals = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          avgDuration: { $avg: '$duration' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byCategory: stats,
        overall: totals[0] || { totalMovies: 0, avgRating: 0, avgDuration: 0 },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du calcul des statistiques',
      error: error.message,
    });
  }
};

// @desc    Récupérer les films similaires (même catégorie, hors film actuel)
// @route   GET /api/movies/:id/similar
// @access  Public
exports.getSimilarMovies = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
      });
    }

    const similarMovies = await Movie.find({
      category: { $in: [movie.category] },
      _id: { $ne: movie._id },
    })
      .limit(6)
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: similarMovies.length,
      data: similarMovies,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de film invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des films similaires',
      error: error.message,
    });
  }
};
