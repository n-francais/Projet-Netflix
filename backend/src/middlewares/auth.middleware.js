const jwt = require('jsonwebtoken');

// Middleware d'authentification JWT
exports.protect = async (req, res, next) => {
  let token;

  // Récupérer le token du header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Si pas de token trouvé
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise',
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-netflix-2024'
    );

    // Ajouter l'ID de l'utilisateur à la requête
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Accès réservé aux administrateurs',
    });
  }
};
