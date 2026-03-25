// app.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json()); // Middleware pour lire le JSON

// Toutes les routes dans userRoutes commenceront par /api/users
app.use('/api/users', userRoutes);

app.listen(3000, () => console.log("Serveur lancé sur le port 3000"));
