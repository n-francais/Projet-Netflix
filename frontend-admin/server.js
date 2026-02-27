const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Netflix Admin - Dashboard',
  });
});

app.get('/movies', (req, res) => {
  res.render('movies', {
    title: 'Gestion des Films',
    movies: [],
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🔧 Serveur admin démarré sur http://localhost:${PORT}`);
});
