const Rental = require('../models/Rental');
const Movie = require('../models/Movie');

// @desc    Créer une location
// @route   POST /api/rentals
// @access  Private
exports.createRental = async (req, res) => {
  try {
    const { movieId, price } = req.body;
    const userId = req.user.id; // Obtenir l'ID de l'utilisateur du middleware auth

    // Vérifier que le film existe
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
      });
    }

    // Vérifier si l'utilisateur a déjà loué ce film
    const existingRental = await Rental.findOne({
      user: userId,
      movie: movieId,
      status: 'active',
    });

    if (existingRental) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà loué ce film',
      });
    }

    const rental = await Rental.create({
      user: userId,
      movie: movieId,
      price: price ?? 3.99,
    });

    // Populate pour retourner les détails complets
    await rental.populate([
      { path: 'movie', select: 'title category year thumbnail rating' },
      { path: 'user', select: 'email role' },
    ]);

    res.status(201).json({
      success: true,
      data: rental,
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
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la location',
      error: error.message,
    });
  }
};

// @desc    Récupérer les locations de l'utilisateur connecté
// @route   GET /api/rentals/my-rentals
// @access  Private
exports.getMyRentals = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenir l'ID de l'utilisateur du middleware auth
    const { status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const rentals = await Rental.find(filter)
      .populate('movie', 'title category year thumbnail rating duration')
      .populate('user', 'email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des locations',
      error: error.message,
    });
  }
};

// @desc    Récupérer toutes les locations (admin)
// @route   GET /api/rentals
// @access  Public
exports.getAllRentals = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [rentals, total] = await Promise.all([
      Rental.find(filter)
        .populate('movie', 'title category year thumbnail rating')
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Rental.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: rentals.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: rentals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des locations',
      error: error.message,
    });
  }
};

// @desc    Annuler une location
// @route   DELETE /api/rentals/:id
// @access  Public
exports.cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Location non trouvée',
      });
    }

    if (rental.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Impossible d'annuler une location avec le statut "${rental.status}"`,
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    await rental.populate([
      { path: 'movie', select: 'title category year thumbnail' },
      { path: 'user', select: 'email role' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Location annulée avec succès',
      data: rental,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de location invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'annulation de la location',
      error: error.message,
    });
  }
};

// @desc    Recommandations de films basées sur l'historique de location
// @route   GET /api/rentals/recommendations?userId=
// @access  Public
exports.getRecommendations = async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre userId est requis',
      });
    }

    const limitNum = Math.min(20, Math.max(1, parseInt(limit, 10)));

    // 1. Récupérer l'historique de location de l'utilisateur avec les détails du film
    const rentals = await Rental.find({ user: userId })
      .populate('movie', 'category _id');

    // 2. Si aucun historique → recommander les films les plus populaires
    if (rentals.length === 0) {
      const popular = await Movie.find()
        .sort({ rating: -1 })
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        type: 'popular',
        message: 'Aucun historique trouvé, voici les films les plus populaires',
        count: popular.length,
        data: popular,
      });
    }

    // 3. Compter les genres préférés de l'utilisateur
    const genreCount = {};
    const rentedMovieIds = [];

    for (const rental of rentals) {
      if (rental.movie) {
        rentedMovieIds.push(rental.movie._id);
        const genre = rental.movie.category;
        if (genre) {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        }
      }
    }

    // 4. Trier les genres par préférence (du plus fréquent au moins fréquent)
    const preferredGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .map(([genre]) => genre);

    // 5. Chercher des films correspondant aux genres préférés, en excluant les films déjà loués
    const recommendations = await Movie.find({
      category: { $in: preferredGenres },
      _id: { $nin: rentedMovieIds },
    })
      .sort({ rating: -1 })
      .limit(limitNum);

    res.status(200).json({
      success: true,
      type: 'personalized',
      preferredGenres,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du calcul des recommandations',
      error: error.message,
    });
  }
};

// @desc    Statistiques des locations
// @route   GET /api/rentals/stats
// @access  Public
exports.getRentalStats = async (req, res) => {
  try {
    const [statsByStatus, revenue, topMovies] = await Promise.all([
      // Répartition par statut
      Rental.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$price' },
          },
        },
      ]),

      // Revenu total (prix × nombre de locations actives/retournées)
      Rental.aggregate([
        {
          $match: { status: { $in: ['active', 'returned'] } },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$price' },
            totalRentals: { $sum: 1 },
            avgPrice: { $avg: '$price' },
          },
        },
      ]),

      // Top 5 films les plus loués
      Rental.aggregate([
        {
          $group: {
            _id: '$movie',
            rentalCount: { $sum: 1 },
            totalRevenue: { $sum: '$price' },
          },
        },
        { $sort: { rentalCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movieDetails',
          },
        },
        {
          $unwind: { path: '$movieDetails', preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            rentalCount: 1,
            totalRevenue: 1,
            title: '$movieDetails.title',
            category: '$movieDetails.category',
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: statsByStatus,
        overall: revenue[0] || { totalRevenue: 0, totalRentals: 0, avgPrice: 0 },
        topMovies,
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
