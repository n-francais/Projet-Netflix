const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Générer un JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key-netflix-2024',
    { expiresIn: '7d' }
  );
};

// @desc    Enregistrement d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont obligatoires',
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    }

    // Hash the password before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
    });

    // Générer le token
    const token = generateToken(user._id);

    // Retourner l'utilisateur et le token (sans le mot de passe)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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
      message: 'Erreur lors de l\'enregistrement',
      error: error.message,
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont obligatoires',
      });
    }

    // Trouver l'utilisateur et inclure le mot de passe pour comparaison
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message,
    });
  }
};

// @desc    Récupérer le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private (nécessite un token)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message,
    });
  }
};
