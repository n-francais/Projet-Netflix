/**
 * Script de seeding : importe les films de data/movies.json dans MongoDB.
 * Usage : node backend/scripts/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Charger les variables d'environnement depuis backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Movie = require('../src/models/Movie');

// Lire le fichier JSON source
const moviesFilePath = path.join(__dirname, '../../data/movies.json');
const rawMovies = JSON.parse(fs.readFileSync(moviesFilePath, 'utf-8'));

// Transformer les données JSON vers le schéma Mongoose
// (le JSON utilise "image" ; le modèle utilise "thumbnail")
const movies = rawMovies.map((m, index) => ({
  title: m.title,
  description: m.description,
  thumbnail: m.image || '',
  banner: m.banner || '',
  category: m.category,
  year: m.year,
  director: m.director || '',
  duration: m.duration,
  rating: m.rating,
  isFeatured: index < 3, // les 3 premiers films sont mis en avant
}));

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion MongoDB établie');

    // Supprimer les films existants avant de réimporter
    await Movie.deleteMany({});
    console.log('🗑️  Collection "movies" vidée');

    const inserted = await Movie.insertMany(movies);
    console.log(`🎬 ${inserted.length} films importés avec succès`);

    inserted.forEach((m) => console.log(`   - [${m._id}] ${m.title}`));
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
  }
};

seedDB();
