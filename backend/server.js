const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const connectDB = require('./src/config/db');
const movieRoutes = require('./src/routes/movieRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/movies', movieRoutes);

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
