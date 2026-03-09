const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre du film est obligatoire'],
      trim: true,
      minlength: [1, 'Le titre ne peut pas être vide'],
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
    },
    // "thumbnail" au sens TP = image affichée sur la carte
    thumbnail: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'L\'année est obligatoire'],
      min: [1888, 'L\'année doit être postérieure à 1888'],
      max: [new Date().getFullYear() + 5, 'L\'année est invalide'],
    },
    director: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: Number,
      min: [1, 'La durée doit être positive'],
    },
    rating: {
      type: Number,
      min: [0, 'La note doit être entre 0 et 10'],
      max: [10, 'La note doit être entre 0 et 10'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', movieSchema);
