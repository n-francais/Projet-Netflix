const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const movieRoutes = require('./src/routes/movie.routes');
const rentalRoutes = require('./src/routes/rental.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connexion à MongoDB
connectDB().catch(err => {
  console.error('Erreur fatale de démarrage:', err);
  process.exit(1);
});

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/rentals', rentalRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Le serveur backend fonctionne correctement',
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Route d'accueil
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Netflix Clone' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎬 Films API: http://localhost:${PORT}/api/movies`);
});
